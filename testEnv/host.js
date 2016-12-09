// test -----------------------------------------------------------------
(function(){
  var playerNum = 0;
  window.test={
    reset : function (){
      window.msg('1|1|SERVER|2|{"clients":{},"obs":{},"status":1,"setup":null,"game":null}');
    },
    add : function (num){
      if (num>6) {
        console.log("%c Illegal Command ", 'color: #cc0000;');
        return;
      }
      var obj = {};
      for (var i=1;i<=num;i++){
        obj['c'+i] = "player "+i;
      }
      playerNum=num;
      window.msg('1|2|SERVER|8|{"clients":'+JSON.stringify(obj)+'}');
    },
    start : function (){
      window.msg('1|3|SERVER|12|null');
    },
    client : function (id, x, y){
      if(id>playerNum){
        console.log("%c Illegal Command ", 'color: #cc0000;');
        return;
      }
      window.msg('2|4|c'+id+'|3|['+x+','+y+']');
    },
    end : function (){
      window.msg('1|5|SERVER|13|null');
    },
    renew : function (){
      window.msg('1|6|SERVER|14|null');
    }
  };

  console.group("%c COMMAND FOR PROGRAM", 'background: #eeeeee; color: #666666;');
  console.log("%c test.start() ", 'color: #666666;');
  console.log("%c test.end() ", 'color: #666666;');
  console.log("%c test.renew() ", 'color: #666666;');
  console.groupEnd();
  console.log('');

  console.group("%c TEST COMMAND ", 'background: #ddeeff; color: #003399;');
  console.log("%c test.reset() ", 'color: #003399;');
  console.log("%c test.add(3) ", 'color: #003399;');
  console.log("%c test.client(1,10,10) ", 'color: #003399;');
  console.groupEnd();
  console.log('');
})();

// ---------------------------------------------------------------------

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
            ws = {conn:wsConnStr};
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
            window.msg = function (msg){
              ws.onmessage({data:msg});
            };
            ws.onopen();
        };
        this.stop = function () {
          console.log("%c ws: [close] ", "color:#660000; background: #ffdddd");
        };
        this.send = function (msg) {
          console.log("%c ws: "+ msg+" ",  "color:#006600; background: #ddffdd");
        }

        var _init = function (opts) {
            window.onbeforeunload = function () {
                if (ws != null) ws.onclose();
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
 * Host Main
 */

(function (Game) {
    // ROOM STATUS
    var STATUS = Game.DATA.ROOMSTATUS;

    var Main = function (components_in) {
        // Data ------------------------------------------------------
        var that = this,
            Message = Game.Message;

        var component = {
            clientList: null,
            game: null,
            websocket: null,
            renderer: null
        };
        var _status = STATUS.READY,
            _setuped = false,           // true if host is ready to use
            _msgReceive = {},        // message handleing functions on received message
            _msgSend_server = null,        // message sending functions
            _msgHandler_server = {};        // server message handler

        // Callback ---------------------------------------------------
        this.onStart = null;
        this.onEnd = null;
        this.onRenew = null;
        this.onPause = null;
        this.onContinue = null;

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
            var gameData = null;
            var clients = null;
            var obs = null;
            if (dat != null) {
                status = dat.status;
                setupData = dat.setup;
                gameData = dat.game;
                clients = dat.clients;
                obs = dat.obs;
            }

            component.clientList.reset(clients, obs);
            component.game.reset(setupData, gameData);
            component.renderer.reset(setupData);
            component.renderer.updateGame(gameData);
            if (status == STATUS.READY) _renew();
            else if (status == STATUS.PLAYING) _start();
            else _end();
            _msgSend_server(Message.CODE.SERVER.HOST_SETUPED);
        };

        // Game ------------------------------------------------------
        var _renew = function () {
            _status = STATUS.READY;
            component.clientList.unlock();
            component.game.renew();
            component.renderer.renew();
            if (that.onRenew) that.onRenew();
        };

        var _start = function () {
            _status = STATUS.PLAYING;
            component.clientList.lock();
            component.game.start();
            component.renderer.start();
            if (that.onStart) that.onStart();
        };

        var _end = function () {
            _status = STATUS.END;
            component.clientList.unlock();
            component.game.end();
            component.renderer.end();
            if (that.onEnd) that.onEnd();
        };

        var _pause = function () {
            component.game.pause();
            component.renderer.pause();
            if (that.onPause) that.onPause();
        };

        var _continue = function () {
            component.game.continue();
            component.renderer.continue();
            if (that.onContinue) that.onContinue();
        };

        // Setup ------------------------------------------------------
        // setup game components and connect them
        var _setupComponent = function (components_in) {
            try {
                component.clientList = components_in.clientList;
                component.game = components_in.game;
                component.renderer = components_in.renderer;
                component.websocket = new Game.WebSocket({
                    type: Game.WebSocket.TYPE.HOST,
                    id: window.parent.HOSTID,
                    host: null
                });

                component.renderer.setupHandler(component.game.handler);

                // game
                component.game.onUpdated = function (gameData) {
                    component.renderer.updateGame(gameData);
                    _msgSend_server(Message.CODE.SERVER.CACHE_GAME, gameData);
                };

                component.game.clientSetup = function (targets, clientData) {
                    component.websocket.send(Message.Encode({
                        type: Message.TYPE.HOST,
                        target: targets,
                        code: Message.CODE.HOST.CLIENT_SETUP,
                        content: JSON.stringify(clientData)
                    }));
                };
                component.game.clientUpdate = function (targets, clientData) {
                    component.websocket.send(Message.Encode({
                        type: Message.TYPE.HOST,
                        target: targets,
                        code: Message.CODE.HOST.CLIENT_UPDATE,
                        content: JSON.stringify(clientData)
                    }));
                };
                component.game.send = function (targets, code, content) {
                    component.websocket.send(Message.Encode({
                        type: Message.TYPE.HOST,
                        target: targets,
                        code: code,
                        content: JSON.stringify(content)
                    }));
                };
                component.game.onSetuped = function (setupData) {
                    component.renderer.reset(setupData);
                    _msgSend_server(Message.CODE.SERVER.CACHE_GAME_SETUP, setupData);
                };

                component.clientList.onUpdateClient = function (clientData) {
                    component.renderer.updateClientList(clientData);
                };

                component.clientList.onUpdateOb = function (obData) {
                    component.renderer.updateObList(obData);
                };

                // renderer
                component.renderer.onSetuped = function () {
                    _setuped = true;
                };
            } catch (e) {
                throw new Error('Unexpected Error in setuping components: ' + e.message);
            }
        };

        var _setupMessageHandler = function () {
            _msgSend_server = function (code, content) {
                component.websocket.send(Message.Encode({
                    type: Message.TYPE.SERVER,
                    code: code,
                    content: content == null ? null : JSON.stringify(content)
                }));
            };

            _msgReceive = {
                SERVER: {},
                HOST: {}
            };

            // SERVER
            _msgReceive.SERVER[Message.CODE.SERVER.HOST_RESET] = function (dat) { _reset(dat); };
            _msgReceive.SERVER[Message.CODE.SERVER.HOST_UPDATE_CLIENTLIST] = function (dat) { component.clientList.updateClientList(dat.clients); };
            _msgReceive.SERVER[Message.CODE.SERVER.HOST_UPDATE_OBLIST] = function (dat) { component.clientList.updateObList(dat.obs); };
            _msgReceive.SERVER[Message.CODE.SERVER.GAME_START] = function (dat) {
                component.game.setup(
                    component.clientList.getClientList(),
                    component.renderer.getSetupPara()
                );
                _start(dat);
            };
            _msgReceive.SERVER[Message.CODE.SERVER.GAME_END] = function (dat) { _end(dat); };
            _msgReceive.SERVER[Message.CODE.SERVER.GAME_RENEW] = function (dat) { _renew(dat); };
            _msgReceive.SERVER[Message.CODE.SERVER.GAME_PAUSE] = function (dat) { _pause(dat); };
            _msgReceive.SERVER[Message.CODE.SERVER.GAME_CONTINUE] = function (dat) { _continue(dat); };
            // HOST
            _msgReceive.HOST[Message.CODE.HOST.ACTION] = function (dat, source) { component.game.action(source, dat); };
            _msgReceive.HOST[Message.CODE.CUSTOMIZED] = function (msg) { component.game.receive(msg); };
        };

        var _setupConn = function () {
            component.websocket.onopen = function () {
                console.log('[ OPEN ]');
            };
            component.websocket.onmessage = function (evt) {
                //console.log(evt.data);
                var msg = Message.Decode(evt.data);
                if (_msgReceive[msg.type].hasOwnProperty(msg.code)) _msgReceive[msg.type][msg.code](msg.content, msg.source);
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
    Game.Host = Game.Host || {};
    Game.Host.Main = Main;
})(Rendxx.Game);
Rendxx = Rendxx || {};
Rendxx.Game = Rendxx.Game || {};

/*
 * Host Controller
 */

(function (Game) {
    var Renderer = function (components_in) {
        // Data ------------------------------------------------------
        var that = this,
            current = null,             // component currently use
            _cache_client = null,       // cache for latest client list data
            _cache_ob = null,           // cache for latest ob list data
            _cache_game = null,         // cache for latest game data
            playing = false;

        var component = {
            prepare: null,
            main: null,
            end: null
        };

        // Callback -----------------------------------------------------------
        this.onSetuped = null;

        // public function ----------------------------------------------------
        this.reset = function (setupData, gameData) {
            component.main.reset(setupData);
            this.updateGame(gameData);
        };

        this.getSetupPara = function () {
            return component.prepare.getSetupPara();
        };

        this.setupHandler = function (handler) {
            component.main.handler = handler;
        };

        // Status Change ------------------------------------------------------
        this.renew = function () {
            playing = false;
            _cache_game = null;
            current = component.prepare;
            current.updateClientList(_cache_client);
            current.updateObList(_cache_ob);
            current.updateGame(_cache_game);

            component.prepare.show();
            component.main.hide();
            component.end.hide();
        };

        this.start = function () {
            playing= true;
            current = component.main;
            current.updateClientList(_cache_client);
            current.updateObList(_cache_ob);
            current.updateGame(_cache_game);

            component.prepare.hide();
            component.main.show();
            component.end.hide();
        };

        this.end = function () {
            playing= false;
            current = component.end;
            current.updateClientList(_cache_client);
            current.updateObList(_cache_ob);
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
        this.updateClientList = function (data) {
            _cache_client = data;
            current.updateClientList(data);
        };

        this.updateObList = function (data) {
            _cache_ob = data;
            current.updateObList(data);
        };

        this.updateGame = function (data) {
            _cache_game = data;
            current.updateGame(data);
        };

        // Setup ------------------------------------------------------
        var _setupComponent = function (components_in) {
            try{
                component.prepare = components_in.prepare;
                component.main = components_in.main;
                component.end = components_in.end;
                current = component.prepare;

                component.main.onSetuped = function () {
                    if (that.onSetuped) that.onSetuped();
                };

            } catch (e) {
                throw new Error('Unexpected Error in setuping components: '+e.message);
            }
        };

        var _init = function (components_in) {
            _setupComponent(components_in);
        }(components_in);
    };
    Game.Host = Game.Host || {};
    Game.Host.Renderer = Renderer;
})(Rendxx.Game);
//# sourceMappingURL=host.js.map
