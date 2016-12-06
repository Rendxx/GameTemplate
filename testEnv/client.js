Rendxx = Rendxx || {};
Rendxx.Game = Rendxx.Game || {};

/*
 * Host Main
 */

(function (Game) {
    // ROOM STATUS 
    DATA= {
        ROOMSTATUS: {
            'READY': 1,
            'PLAYING': 2,
            'END': 3,
            1: 'READY',
            2: 'PLAYING',
            3: 'END'
        }
    };
    Game.DATA = DATA;
})(Rendxx.Game);
var Rendxx = Rendxx || {};
Rendxx.Game = Rendxx.Game || {};

// Websocket Handler
(function (Game) {
    var TYPE = {
        SERVER: 1,
        HOST: 2,
        CLIENT: 3,
        OBSERVER: 4
    };
    var MyWebSocket = function (opts_in) {
        'use strict';
        var that = this;
        var ws = null;
        var wsConnStr;
        
        this.onopen = null;
        this.onmessage = null;
        this.onerror = null;
        this.onclose = null;

        this.start = function () {
            if (ws != null) ws.close();
            ws = new WebSocket(wsConnStr);
            ws.onopen = function (evt) {
                if (that.onopen != null) that.onopen(evt);
            };
            ws.onmessage = function (evt) {
                if (that.onmessage != null) that.onmessage(evt);
            };
            ws.onerror = function (evt) {
                if (that.onerror != null) that.onerror(evt);
            };
            ws.onclose = function (evt) {
                if (that.onclose != null) that.onclose(evt);
            };
        };
        this.stop = function () {
            if (ws == null) return;
            ws.close();
        };
        this.send = function (msg) {
            if (ws == null) throw new Error('Connection is not available');
            ws.send(msg);
        }

        var _init = function (opts) {
            window.onbeforeunload = function () {
                if (ws != null) ws.close();
            };
            if (opts == null || opts.type == null || opts.id == null) throw new Error('WebSocket Parameter Missing');

            var hostName = opts.host || window.location.hostname;
            wsConnStr = "ws://" + hostName + "/api/Conn/" + opts.type + '?id=' + opts.id;
        }(opts_in);
    };
    Game.WebSocket = MyWebSocket;
    Game.WebSocket.TYPE = TYPE;
})(Rendxx.Game);

Rendxx = Rendxx || {};
Rendxx.Game = Rendxx.Game || {};

(function (Game) {
    var TYPE = {
        'SERVER': 1,
        'HOST': 2,
        'CLIENT': 3,
        1: 'SERVER',
        2: 'HOST',
        3: 'CLIENT'
    };

    var TARGET = {
        'SERVER': 'SERVER',
        'HOST': 'HOST'
    };

    var CODE = {
        SERVER:{
            'NO_CODE': 0,
            'HOST_RESET_REQUEST' : 1,
            'HOST_RESET' : 2,
            'CLIENT_RESET_REQUEST' : 3,
            'CLIENT_RESET' : 4,
            'OB_RESET_REQUEST' : 5,
            'OB_RESET' : 6,
            'HOST_SETUPED' : 7,
            'HOST_UPDATE_CLIENTLIST' : 8,
            'HOST_UPDATE_OBLIST' : 9,
            'CACHE_GAME_SETUP' : 10,
            'CACHE_GAME' : 11,
            'GAME_START' : 12,
            'GAME_END' : 13,
            'GAME_RENEW': 14,
            'GAME_PAUSE': 15,
            'GAME_CONTINUE': 16,
            'GAME_SETUP': 17,
            'GAME_UPDATE': 18,
            'CACHE_OB': 18
        },
        HOST: {
            'NO_CODE': 0,
            'CLIENT_SETUP': 1,
            'CLIENT_UPDATE': 2,
            'ACTION': 3
        },
        CUSTOMIZED: 'CUSTOMIZED'
    };

    var timeStamp = function () {
        return Date.now() + "";
    };

    var messageDecode = function (msgStr) {
        var msg = {};
        try {
            var tmp = msgStr.split('|');
            msg['type'] = TYPE[Number(tmp[0])];
            msg['timestamp'] = tmp[1];
            msg['source'] = tmp[2];
            msg['code'] = Number(tmp[3]);
            msg['content'] = $.parseJSON(tmp[4]);
            return msg;
        } catch (e) {
            throw new Error("Illegal command");
        }
    };

    var messageEncode = function (msg) {
        if (msg == null || msg.type == null || msg.code == null) return;
        var d1 = Game.Message.DELIMITER.PART,
            d2 = Game.Message.DELIMITER.TARGET;
        return msg['type'] + d1
            + ('timestamp' in msg ? msg['timestamp'] : timeStamp()) + d1
            + (('target' in msg && msg['target'].length > 0) ? msg['target'].join(d2) : '') + d1
            + msg['code'] + d1
            + ('content' in msg ? msg['content'] : '');
    };

    // create JS hack
    if (!Date.now) {
        Date.now = function () { return new Date().getTime(); }
    }

    Game.Message = {
        TYPE: TYPE,
        TARGET: TARGET,
        CODE: CODE,
        DELIMITER: {
            PART: '|',
            TARGET: ','
        },
        Decode: messageDecode,
        Encode: messageEncode
    };
})(Rendxx.Game);
Rendxx = Rendxx || {};
Rendxx.Game = Rendxx.Game || {};

/*
 * Client Main
 */

(function (Game) {
    var STATUS = Game.DATA.ROOMSTATUS;
    var Main = function (components_in) {
        // Data ------------------------------------------------------
        var that = this,
            Message = Game.Message;

        var component = {
            renderer: null,
            websocket: null
        };

        var controller = {};

        var _status = STATUS.READY,
            _setuped = false,           // true if host is ready to use
            _msgReceive = {};        // message handleing functions on received message
        
        // Public function --------------------------------------------
        // setup and start working
        this.setup = function () {
            _setupConn();
        };

        // Private function -------------------------------------------
        // reset game data
        var _reset = function (dat) {
            var status = STATUS.READY;
            var setupData = null;
            var clientData = null;
            if (dat != null) {
                status = dat.status;
                setupData = dat.setup;
                clientData = dat.client;
            }

            component.renderer.reset(setupData);
            component.renderer.updateGame(clientData);
            if (status == STATUS.READY) _renew();
            else if (status == STATUS.PLAYING) _start();
            else _end();
        };

        // game ------------------------------------------------
        var _renew = function () {
            _status = STATUS.READY;
            component.renderer.renew();
        };

        var _start = function () {
            component.websocket.send(Message.Encode({
                type: Message.TYPE.SERVER,
                code: Message.CODE.SERVER.OB_RESET_REQUEST
            }));
            _status = STATUS.PLAYING;
            component.renderer.start();
        };

        var _end = function () {
            _status = STATUS.END;
            component.renderer.end();
        };

        var _pause = function () {
            component.renderer.pause();
        };

        var _continue = function () {
            component.renderer.continue();
        };

        // Setup ------------------------------------------------------
        var _setupComponent = function (components_in) {
            try {
                component.renderer = components_in.renderer;
                component.websocket = new Game.WebSocket({
                    type: Game.WebSocket.TYPE.CLIENT,
                    id: window.parent.CLIENTID,
                    host: null
                });

                component.renderer.message.send = function (code, content) {
                    component.websocket.send(Message.Encode({
                        type: Message.TYPE.HOST,
                        target: [Message.TARGET.HOST],
                        code: code,
                        content: JSON.stringify(content)
                    }));
                };
                component.renderer.message.action = function (content) {
                    component.websocket.send(Message.Encode({
                        type: Message.TYPE.HOST,
                        target: [Message.TARGET.HOST],
                        code: Message.CODE.HOST.ACTION,
                        content: JSON.stringify(content)
                    }));
                };
            } catch (e) {
                throw new Error('Unexpected Error in setuping components: '+e.message);
            }
        };

        var _setupMessageHandler = function () {
            _msgReceive = {
                SERVER: {},
                HOST: {},
                CLIENT: {}
            };

            // SERVER
            _msgReceive.SERVER[Message.CODE.SERVER.CLIENT_RESET] = function (dat) { _reset(dat); };
            _msgReceive.SERVER[Message.CODE.SERVER.GAME_START] = function (dat) { _start(dat); };
            _msgReceive.SERVER[Message.CODE.SERVER.GAME_UPDATE] = function (dat) { component.renderer.updateGame(dat); };
            _msgReceive.SERVER[Message.CODE.SERVER.GAME_END] = function (dat) { _end(dat); };
            _msgReceive.SERVER[Message.CODE.SERVER.GAME_RENEW] = function (dat) { _renew(dat); };
            _msgReceive.SERVER[Message.CODE.SERVER.GAME_PAUSE] = function (dat) { _pause(dat); };
            _msgReceive.SERVER[Message.CODE.SERVER.GAME_CONTINUE] = function (dat) { _continue(dat); };
            // HOST
            _msgReceive.HOST[Message.CODE.HOST.CLIENT_SETUP] = function (dat) { component.renderer.reset(dat); };
            _msgReceive.HOST[Message.CODE.HOST.CLIENT_UPDATE] = function (dat) { component.renderer.updateGame(dat); };
            _msgReceive.HOST[Message.CODE.CUSTOMIZED] = function (msg) { component.renderer.receive(msg); };
        };

        var _setupConn = function () {
            component.websocket.onopen = function () {
                console.log('[ OPEN ]');
                component.websocket.send(Message.Encode({
                    type: Message.TYPE.SERVER,
                    code: Message.CODE.SERVER.NO_CODE,
                    content: null
                }));
            };
            component.websocket.onmessage = function (evt) {
                //console.log(evt.data);
                var msg = Message.Decode(evt.data);
                if (_msgReceive[msg.type].hasOwnProperty(msg.code)) _msgReceive[msg.type][msg.code](msg.content);
                else if (msg.type == Message.TYPE.HOST) _msgReceive[msg.type][Message.CODE.CUSTOMIZED](msg);
            };
            component.websocket.onerror = function () {
                console.log('[ ERROR ]');
            };
            component.websocket.onclose = function () {
                console.log('[ CLOSE ]');
            };
            component.websocket.start();
        };

        var _init = function (components_in) {
            _setupComponent(components_in);
            _setupMessageHandler();
        }(components_in);
    };
    Game.Client = Game.Client || {};
    Game.Client.Main = Main;
})(Rendxx.Game);
Rendxx = Rendxx || {};
Rendxx.Game = Rendxx.Game || {};

/*
 * Client Renderer
 */

(function (Game) {
    var Renderer = function (components_in) {
        // Data ------------------------------------------------------
        var that = this,
            current = null,             // component currently use
            _cache_game = null,         // cache for latest game data
            playing = false;

        var component = {
            prepare: null,
            main: null,
            end: null
        };

        // Callback -----------------------------------------------------------
        this.onSetuped = null;
        this.message = {};

        // public function ----------------------------------------------------
        this.reset = function (setupData) {
            if (setupData) component.main.reset(setupData);
        };

        this.getSetupPara = function () {
            return component.prepare.getSetupPara();
        };

        // Status Change ------------------------------------------------------
        this.renew = function () {
            playing = false;
            _cache_game = null;
            current = component.prepare;
            current.updateGame(_cache_game);

            component.prepare.show();
            component.main.hide();
            component.end.hide();
        };

        this.start = function () {
            playing= true;
            current = component.main;
            current.updateGame(_cache_game);

            component.prepare.hide();
            component.main.show();
            component.end.hide();
        };

        this.end = function () {
            playing= false;
            current = component.end;
            current.updateGame(_cache_game);

            component.prepare.hide();
            component.main.hide();
            component.end.show();
        };

        this.pause = function () {
            if (!playing) return;
            current.pause();
        };

        this.continue = function () {
            if (!playing) return;
            current.continue();
        };

        // Update -----------------------------------------------------
        this.updateGame = function (data) {
            _cache_game = data;
            current.updateGame(data);
        };

        // Setup ------------------------------------------------------
        var _setupComponent = function (components_in) {
            try {
                component.prepare = components_in.prepare;
                component.main = components_in.main;
                component.end = components_in.end;
                current = component.prepare;

                component.main.onSetuped = function () {
                    if (that.onSetuped) that.onSetuped();
                };
                component.main.message = that.message;

            } catch (e) {
                throw new Error('Unexpected Error in setuping components: '+e.message);
            }
        };
                
        var _init = function (components_in) {
            _setupComponent(components_in);
        }(components_in);
    };
    Game.Client = Game.Client || {};
    Game.Client.Renderer = Renderer;
})(Rendxx.Game);
//# sourceMappingURL=client.js.map
