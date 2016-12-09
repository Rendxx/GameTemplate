/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!***************************!*\
  !*** ./src/host/Index.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	/* TODO:
	    Fetch all modules and put them into a global object.
	    Then we can use them in Host.html.
	*/
	
	var Style = __webpack_require__(/*! ./less/Index.less */ 1);
	
	window.GAME = {
	  ClientList: __webpack_require__(/*! ./js/ClientList.js */ 6),
	  Core: __webpack_require__(/*! ./js/Core.js */ 7),
	  Render: {
	    Prepare: __webpack_require__(/*! ./js/Render.Prepare.js */ 8),
	    Main: __webpack_require__(/*! ./js/Render.Main.js */ 11),
	    End: __webpack_require__(/*! ./js/Render.End.js */ 14)
	  }
	};

/***/ },
/* 1 */
/*!**********************************!*\
  !*** ./src/host/less/Index.less ***!
  \**********************************/
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/*!***********************************!*\
  !*** ./src/host/js/ClientList.js ***!
  \***********************************/
/***/ function(module, exports) {

	/* TODO:
	    ClientList manager all clients join the game.
	    - It will tell Prepare-Module when client list changes.
	    - It will initialize the player data when game starts.
	*/
	
	var ClientList = function (opts_in) {
	    "use strick";
	    // Property -----------------------------------------------
	
	    var that = this,
	        _max = 5,
	        _isLocker = false;
	
	    var clients = {},
	        // { id:<number>, name:<string>, number:<number>}
	    players = []; // queue of players, starts from 0
	
	    // callback ------------------------------------------
	    this.onUpdateClient = null; /* TODO: callback: send client data if update */
	    this.onUpdateOb = null; /* TODO: deprecated */
	
	    // API -----------------------------------------------
	    this.reset = function (clientData) {
	        /* TODO: reset all client data */
	        clients = {};
	        players = [];
	        for (var i = 0; i < _max; i++) players[i] = null;
	        for (var id in clientData) {
	            addClient(id, clientData[id]);
	        }
	        if (this.onUpdateClient) this.onUpdateClient(clients);
	    };
	
	    this.updateClientList = function (clientData) {
	        /* TODO: update the client data, keep them as same as the input */
	        for (var id in clients) {
	            if (id in clientData) continue;
	            removeClient(id);
	        }
	        for (var id in clientData) {
	            if (id in clients) continue;
	            addClient(id, clientData[id]);
	        }
	        if (this.onUpdateClient) this.onUpdateClient(clients);
	    };
	
	    this.updateObList = function (obData) {
	        /* TODO: deprecated */
	    };
	
	    this.getClientList = function () {
	        /* TODO: initialize the client data. */
	        return players;
	    };
	
	    // Lock -----------------------------------------------
	    this.lock = function () {
	        /* TODO: make client list unchangeable. */
	        _isLocker = true;
	    };
	
	    this.unlock = function () {
	        /* TODO: make client list changeable. */
	        _isLocker = false;
	    };
	
	    // Client Add / Remove -----------------------------------------------
	    var addClient = function (id, name) {
	        clients[id] = {
	            id: id,
	            name: name,
	            number: -1
	        };
	
	        if (_isLocker) return;
	        for (var i = 0; i < _max; i++) {
	            if (players[i] == null) {
	                clients[id].number = i;
	                players[i] = {
	                    name: name,
	                    id: id
	                };
	                break;
	            }
	        }
	    };
	
	    var removeClient = function (id) {
	        var n = clients[id].number;
	        delete clients[id];
	        if (n == -1) return;
	        if (_isLocker) return;
	        players[n] = null;
	    };
	
	    // Setup -----------------------------------------------
	    var _init = function (opts_in) {
	        _max = opts_in.max;
	        for (var i = 0; i < _max; i++) players[i] = null;
	    }(opts_in);
	};
	
	module.exports = ClientList;

/***/ },
/* 7 */
/*!*****************************!*\
  !*** ./src/host/js/Core.js ***!
  \*****************************/
/***/ function(module, exports) {

	/* TODO:
	    This is the primary part of this game.
	    - It setups the game with initial options and create setup data.
	    - It receives and run user's operation.
	    - It keeps sending game data to renderer, server and clients.
	    - It monitors game process and decides the next status of the game.
	*/
	
	var Core = function () {
	    "use strick";
	    // property -----------------------------------------------
	
	    var that = this,
	        start = false,
	        _color = null,
	        _players = null,
	        _playersId = null,
	        _playerMap = null,
	        _playerPos = [];
	
	    // message -----------------------------------------------
	    this.send = null; /* TODO: this.send(code, content): This function should be set by Host-Manager, it is used to send message out */
	    this.handler = {}; /* TODO: this is a package of hander for Render.Main */
	
	    this.receive = function (msg) {
	        /* TODO:
	            receive unordinary message.
	            you can use this port to handle customized message format
	        */
	    };
	
	    this.action = function (clientId, dat) {
	        /* TODO:
	            will be fired when a client takes a move.
	            analysis the action data and handle this change.
	        */
	
	        if (!start) return;
	        // otherwise move the player's marker
	        var pos = _playerPos[_playerMap[clientId]];
	        pos[0] = Math.max(0, Math.min(100, pos[0] + dat[0]));
	        pos[1] = Math.max(0, Math.min(100, pos[1] + dat[1]));
	
	        this.onUpdated({ pos: _playerPos });
	        this.clientUpdate(_playersId, {
	            current: _playerMap[clientId]
	        });
	    };
	
	    // callback ------------------------------------------
	    this.onUpdated = null; // (gameData): becalled when game updates
	    this.onSetuped = null; // (setupData): be called when game setups
	    this.clientSetup = null; // (target, clientData) setup client, be called when game setups
	    this.clientUpdate = null; // (target, clientData) update client side, be called when anything related to that client updates
	
	    // update ---------------------------------------------
	    this.reset = function (setupData, gameData) {
	        /* TODO:
	            reset game with given data.
	            the game will be recovered if gameData provided
	        */
	
	        if (setupData != null) {
	            _players = setupData.player;
	            _playersId = setupData.playerId;
	            _playerMap = setupData.playerMap;
	            _playerPos = setupData.playerPos;
	            _color = setupData.color;
	        }
	        if (gameData != null) {
	            _playerPos = gameData.pos;
	            this.onUpdated({ pos: _playerPos });
	        }
	    };
	
	    this.setup = function (playerData, para) {
	        /* TODO:
	            setup the game with player data and initial options.
	            then send the setup data out
	        */
	
	        _players = [];
	        _playersId = [];
	        _playerMap = {};
	        _playerPos = [];
	        _color = para.color;
	
	        for (var i = 0, count = playerData.length; i < count; i++) {
	            if (playerData[i] == null) continue;
	
	            var playerObj = {
	                id: playerData[i].id,
	                name: playerData[i].name
	            };
	            _players.push(playerObj);
	            _playersId.push(playerObj.id);
	            _playerMap[playerObj.id] = i;
	            _playerPos.push([~~(Math.random() * 100), ~~(Math.random() * 100)]);
	        }
	
	        this.onSetuped({
	            playerMap: _playerMap,
	            player: _players,
	            playerId: _playersId,
	            playerPos: _playerPos,
	            color: _color
	        });
	        for (var i = 0; i < _players.length; i++) {
	            this.clientSetup([_players[i].id], {
	                id: i,
	                current: -1
	            });
	        }
	    };
	
	    // game ------------------------------------------------
	    this.start = function () {
	        /* TODO: game start */
	        start = true;
	    };
	
	    this.end = function () {
	        /* TODO: game end */
	        start = false;
	    };
	
	    this.renew = function () {
	        /* TODO: game renew */
	        start = false;
	        _color = null;
	        _players = null;
	        _playerMap = null;
	        _playerPos = null;
	    };
	    this.pause = function () {
	        /* TODO: game parse */
	    };
	    this.continue = function () {
	        /* TODO: game continue */
	    };
	
	    // private ---------------------------------------------
	    var win = function (clientId) {
	        // Host select a player to win
	        var p = [];
	        for (var i = 0; i < _players.length; i++) {
	            p[i] = { id: _players[i].id, name: _players[i].name, win: false };
	        }
	        p[_playerMap[clientId]].win = true;
	        that.onUpdated({
	            end: p,
	            pos: _playerPos
	        });
	        for (var i = 0; i < _players.length; i++) {
	            that.clientUpdate([_players[i].id], {
	                end: p[i].win
	            });
	        }
	        window.test.end();
	        /* TODO: use the line below in real env
	             $.get('/Host/End')
	        */
	        start = false;
	    };
	
	    // setup -----------------------------------------------
	    var _init = function () {
	        that.handler.win = win;
	    }();
	};
	
	module.exports = Core;

/***/ },
/* 8 */
/*!***************************************!*\
  !*** ./src/host/js/Render.Prepare.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	/* TODO:
	    Prepare-Screen is the screen before game starting.
	    You can set game options while waiting for other players.
	*/
	
	var Style = __webpack_require__(/*! ../less/Prepare.less */ 9);
	
	var HTML = {
	    playerList: '<div class="_playerList"></div>',
	    item: '<div class="_item"></div>',
	    colorSelector: '<div class="colorSelector"><span></span></div>',
	    colorList: '<div class="_colorList"></div>',
	    colorItem: '<div class="_item"><span></span></div>',
	    startBtn: '<div class="_start">START</div>'
	};
	
	var CSS = {
	    occupied: '_occupied',
	    hidden: '_hidden'
	};
	
	var Prepare = function (container, opts_in) {
	    "use strick";
	    // Property -------------------------------------
	
	    var // html
	    html = {
	        container: $(container),
	        startBtn: null,
	        playerList: null,
	        player: [],
	        colorSelector: null,
	        colorList: null,
	        colorItem: {}
	    },
	
	
	    // data
	    maxPlayer = 0,
	        colorOption = null,
	        colorId = null,
	
	
	    // cache
	    cache_client = null;
	
	    // Callback -------------------------------------
	
	    // interface controll --------------------------------
	    this.show = function () {
	        /* TODO: show Prepare-Screen */
	        _renderClient(cache_client);
	        html['container'].fadeIn();
	    };
	
	    this.hide = function () {
	        /* TODO: hide Prepare-Screen */
	        html['container'].fadeOut();
	    };
	
	    // Update ---------------------------------------
	    this.updateClientList = function (clientData) {
	        /* TODO: update client list shown on the screen */
	        cache_client = clientData;
	        _renderClient(clientData);
	    };
	
	    this.updateObList = function (obData) {
	        /* TODO: deprecated */
	    };
	
	    this.updateGame = function (gameData) {
	        /* TODO: do nothing */
	    };
	
	    // api -------------------------------------------
	    this.getSetupPara = function () {
	        /* TODO: return game options */
	        return {
	            color: colorOption[colorId]
	        };
	    };
	
	    // Private ---------------------------------------
	    var _renderClient = function (clientData) {
	        if (clientData == null) return;
	        // player
	        var occupiedNumber = {};
	        for (var id in clientData) {
	            if (clientData[id].number == -1) continue;
	            occupiedNumber[clientData[id].number] = id;
	        }
	
	        for (var i = 0; i < maxPlayer; i++) {
	            if (i in occupiedNumber) {
	                html['player'][i].html(clientData[occupiedNumber[i]].name).addClass(CSS.occupied);
	            } else {
	                html['player'][i].html("").removeClass(CSS.occupied);
	            }
	        }
	    };
	
	    var _selectColor = function (id) {
	        colorId = id;
	        html['colorSelector'].children('span').text(id);
	        html['colorSelector'][0].style.backgroundColor = colorOption[id];
	    };
	
	    // Setup -----------------------------------------
	    var _setupHtml = function () {
	        // player list
	        html['playerList'] = $(HTML.playerList).appendTo(html['container']);
	        for (var i = 0; i < maxPlayer; i++) {
	            html['player'][i] = $(HTML.item).appendTo(html['playerList']);
	        }
	
	        // start btn
	        html['startBtn'] = $(HTML.startBtn).appendTo(html['container']);
	        html['startBtn'].click(function () {
	            window.test.start();
	            /* TODO: use the line below in real env
	                 $.get('/Host/Start');
	            */
	        });
	
	        // color selector
	        html['colorSelector'] = $(HTML.colorSelector).appendTo(html['container']);
	        html['colorList'] = $(HTML.colorList).appendTo(html['container']).addClass(CSS.hidden);
	        for (var i in colorOption) {
	            var ele = $(HTML.colorItem).appendTo(html['colorList']);
	            ele.children('span').text(i);
	            ele[0].style.backgroundColor = colorOption[i];
	            if (colorId == null) _selectColor(i);
	            ele.click({ id: i }, function (e) {
	                _selectColor(e.data.id);
	                html['colorList'].toggleClass(CSS.hidden);
	            });
	            html['colorItem'][i] = ele;
	        }
	        html['colorSelector'].click(function () {
	            html['colorList'].toggleClass(CSS.hidden);
	        });
	    };
	
	    var _init = function (opts_in) {
	        maxPlayer = opts_in.maxPlayer;
	        colorOption = opts_in.colorOption || {};
	        _setupHtml();
	    }(opts_in);
	};
	
	module.exports = Prepare;

/***/ },
/* 9 */
/*!************************************!*\
  !*** ./src/host/less/Prepare.less ***!
  \************************************/
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 10 */,
/* 11 */
/*!************************************!*\
  !*** ./src/host/js/Render.Main.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	/* TODO:
	    Main-Screen is the main screen.
	    It renders the game.
	*/
	
	var Style = __webpack_require__(/*! ../less/Main.less */ 12);
	
	var HTML = {
	    player: '<div class="_player"></div>',
	    board: '<div class="_board"></div>'
	};
	
	var Main = function (container) {
	    "use strick";
	    // property -----------------------------------------------
	
	    var that = this;
	    var width = 0,
	        height = 0;
	    var cache_pos = null;
	    var html = {
	        container: $(container),
	        board: null,
	        player: []
	    };
	
	    // callback ------------------------------------------
	    this.handler = {}; /* TODO: this is a package of hander provided by Core. You can use these handler to control the game at Host */
	
	    // interface controll --------------------------------
	    this.show = function () {
	        /* TODO: show Main-Screen */
	        html['container'].fadeIn();
	        _render();
	    };
	
	    this.hide = function () {
	        /* TODO: hide Main-Screen */
	        html['container'].fadeOut();
	    };
	
	    // update ---------------------------------------------
	    this.reset = function (setupData) {
	        /* TODO: initialize the game */
	        if (setupData == null) return;
	        _clear();
	        var player = setupData.player;
	        var color = setupData.color;
	        cache_pos = setupData.playerPos;
	        for (var i = 0; i < player.length; i++) {
	            _addPlayer(i, player[i].id, player[i].name, color);
	        }
	        _render();
	    };
	
	    this.updateClientList = function (clientData) {
	        /* TODO: do nothing */
	    };
	
	    this.updateObList = function (obData) {
	        /* TODO: deprecated */
	    };
	
	    this.updateGame = function (gameData) {
	        /* TODO: update the game with game data */
	        if (gameData == null) return;
	        cache_pos = gameData.pos;
	        _render();
	    };
	
	    // game ------------------------------------------------
	    this.pause = function () {
	        /* TODO: game parse */
	    };
	    this.continue = function () {
	        /* TODO: game continue */
	    };
	
	    // private ---------------------------------------------
	    var _clear = function () {
	        html['board'].empty();
	        html['player'] = [];
	    };
	    var _render = function () {
	        width = html['board'].width();
	        height = html['board'].height();
	        for (var i = 0; i < cache_pos.length; i++) {
	            var pos = cache_pos[i];
	            html['player'][i][0].style.left = pos[0] / 100 * width + 'px';
	            html['player'][i][0].style.top = pos[1] / 100 * height + 'px';
	        }
	    };
	
	    var _addPlayer = function (idx, clientId, name, color) {
	        var playerNode = $(HTML.player).appendTo(html['board']).text(name);
	        playerNode[0].style.backgroundColor = color;
	        html['player'][idx] = playerNode;
	
	        playerNode[0].addEventListener('click', function () {
	            $$.info.check(name + " will win this game?", null, true, "rgba(0,0,0,0.6)", function () {
	                that.handler.win(clientId);
	            });
	        }, false);
	    };
	
	    // setup -----------------------------------------------
	    var _setupHtml = function () {
	        html['board'] = $(HTML.board).appendTo(html['container']);
	    };
	
	    var _init = function () {
	        _setupHtml();
	    }();
	};
	
	module.exports = Main;

/***/ },
/* 12 */
/*!*********************************!*\
  !*** ./src/host/less/Main.less ***!
  \*********************************/
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 13 */,
/* 14 */
/*!***********************************!*\
  !*** ./src/host/js/Render.End.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	/* TODO:
	    End-Screen is the screen after game end.
	    Show the game result in this screen.
	*/
	
	var Style = __webpack_require__(/*! ../less/End.less */ 15);
	
	var HTML = {
	    list: '<div class="_list"></div>',
	    player: '<div class="_player"></div>',
	    renewBtn: '<div class="_renew">RENEW</div>'
	};
	
	var CSS = {
	    win: '_win'
	};
	
	var End = function (container) {
	    "use strick";
	    // property -----------------------------------------------
	
	    var html_wrap = $('.end'),
	        html_content = null,
	        html_renew = null;
	
	    var html = {
	        container: $(container),
	        board: null,
	        renew: null
	    };
	
	    // interface controll --------------------------------
	    this.show = function () {
	        /* TODO: show End-Screen */
	        html['container'].fadeIn();
	    };
	
	    this.hide = function () {
	        /* TODO: hide End-Screen */
	        html['container'].fadeOut();
	    };
	
	    // Update ---------------------------------------
	    this.updateClientList = function (clientData) {
	        /* TODO: do nothing */
	    };
	
	    this.updateObList = function (obData) {
	        /* TODO: deprecated */
	    };
	
	    this.updateGame = function (gameData) {
	        /* TODO:
	            create End-Screen.
	            end data should be contained in input data.
	        */
	        if (gameData && gameData.end) {
	            var s = "";
	            html['list'].empty();
	            var end = gameData.end;
	            for (var i = 0; i < end.length; i++) {
	                _addPlayer(end[i].name, end[i].win);
	            }
	        }
	    };
	
	    // Private ---------------------------------------
	    var _addPlayer = function (name, win) {
	        var playerNode = $(HTML.player).appendTo(html['list']).text(name);
	        if (win) playerNode.addClass(CSS.win);
	    };
	
	    // setup -----------------------------------------------
	    var _setupHtml = function () {
	        html['list'] = $(HTML.list).appendTo(html['container']);
	        html['renew'] = $(HTML.renewBtn).appendTo(html['container']);
	        html['renew'].click(function () {
	            window.test.renew();
	            //$.get('/Host/Renew');
	        });
	    };
	
	    var _init = function () {
	        _setupHtml();
	    }();
	};
	
	module.exports = End;

/***/ },
/* 15 */
/*!********************************!*\
  !*** ./src/host/less/End.less ***!
  \********************************/
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);
//# sourceMappingURL=host.js.map