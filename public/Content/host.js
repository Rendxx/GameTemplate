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

	var ClientList = __webpack_require__(/*! ./js/ClientList.js */ 1);
	var Core = __webpack_require__(/*! ./js/Core.js */ 2);
	var Render = {
	  Prepare: __webpack_require__(/*! ./js/Render.Prepare.js */ 3),
	  Main: __webpack_require__(/*! ./js/Render.Main.js */ 8),
	  End: __webpack_require__(/*! ./js/Render.End.js */ 11)
	};
	
	var Style = __webpack_require__(/*! ./less/Index.less */ 14);
	
	window.GAME = {
	  ClientList: ClientList,
	  Core: Core,
	  Render: Render
	};

/***/ },
/* 1 */
/*!***********************************!*\
  !*** ./src/host/js/ClientList.js ***!
  \***********************************/
/***/ function(module, exports) {

	
	var ClientList = function (opts_in) {
	    // Property -----------------------------------------------
	    var that = this,
	        _max = 5,
	        _isLocker = false;
	
	    var clients = {},
	        // { id:<number>, name:<string>, number:<number>}
	    players = []; // queue of players, starts from 0
	
	    // callback ------------------------------------------
	    this.onUpdateClient = null;
	    this.onUpdateOb = null; // deprecated
	
	    // API -----------------------------------------------
	    // reset game with given data
	    this.reset = function (clientData) {
	        clients = {};
	        players = [];
	        for (var i = 0; i < _max; i++) players[i] = null;
	        for (var id in clientData) {
	            addClient(id, clientData[id]);
	        }
	        if (this.onUpdateClient) this.onUpdateClient(clients);
	    };
	
	    // refresh client list
	    this.updateClientList = function (clientData) {
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
	
	    // refresh ob list
	    this.updateObList = function (obData) {
	        // deprecated
	    };
	
	    // get client data
	    this.getClientList = function () {
	        return players;
	    };
	
	    // Lock -----------------------------------------------
	    this.lock = function () {
	        _isLocker = true;
	    };
	
	    this.unlock = function () {
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
/* 2 */
/*!*****************************!*\
  !*** ./src/host/js/Core.js ***!
  \*****************************/
/***/ function(module, exports) {

	var Core = function () {
	    // property -----------------------------------------------
	    var that = this,
	        start = false,
	        msg = null,
	        _color = null,
	        _players = null,
	        _playersId = null,
	        _playerMap = null,
	        _playerPos = [];
	
	    // message -----------------------------------------------
	    this.send = null; // (code, content)
	
	    this.receive = function (msg) {};
	
	    this.action = function (clientId, dat) {
	        if (!start) return;
	
	        if (dat.dat == "END") {
	            var p = {};
	            for (var i in _playerMap) {
	                p[_players[_playerMap[i]].id] = { name: _players[_playerMap[i]].name, win: false };
	            }
	            p[_players[_playerMap[clientId]].id].win = true;
	            this.onUpdated({ end: p });
	            for (var i = 0; i < _players.length; i++) {
	                this.clientUpdate([_players[i].id], {
	                    end: p[_players[i].id].win
	                });
	            }
	            //$.get('/Host/End')
	        } else {
	            var pos = _playerPos[_playerMap[clientId]];
	            pos[0] = Math.max(0, Math.min(100, pos[0] + dat[0]));
	            pos[1] = Math.max(0, Math.min(100, pos[1] + dat[1]));
	
	            this.onUpdated({ pos: _playerPos });
	            this.clientUpdate(_playersId, {
	                current: _playerMap[clientId]
	            });
	        }
	    };
	
	    // callback ------------------------------------------
	    this.onUpdated = null; // (gameData)
	    this.onSetuped = null; // (setupData)
	    this.clientSetup = null; // (target, clientData)
	    this.clientUpdate = null; // (target, clientData)
	
	    // update ---------------------------------------------
	    // reset game with given data
	    this.reset = function (setupData, gameData) {
	        if (setupData != null) {
	            _players = setupData.player;
	            _playersId = setupData.playerId;
	            _playerMap = setupData.playerMap;
	            _playerPos = setupData.playerPos;
	            _color = setupData.color;
	        }
	        if (gameData != null) {
	            _playerPos = gameData.pos;
	        }
	    };
	
	    this.setup = function (playerData, para) {
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
	        start = true;
	    };
	    this.end = function () {
	        start = false;
	    };
	    this.renew = function () {
	        start = false;
	        _color = null;
	        _players = null;
	        _playerMap = null;
	        _playerPos = null;
	    };
	    this.pause = function () {};
	    this.continue = function () {};
	
	    // setup -----------------------------------------------
	    var _init = function () {}();
	};
	
	module.exports = Core;

/***/ },
/* 3 */
/*!***************************************!*\
  !*** ./src/host/js/Render.Prepare.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	var Style = __webpack_require__(/*! ../less/Prepare.less */ 4);
	
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
	
	
	    // flag
	    isShown = false,
	
	
	    // cache
	    cache_client = null,
	        cache_ob = null,
	        cache_game = null;
	
	    // Callback -------------------------------------
	
	    // interface controll --------------------------------
	    this.show = function () {
	        isShown = true;
	        _renderClient(cache_client);
	        html['container'].fadeIn();
	    };
	
	    this.hide = function () {
	        isShown = false;
	        html['container'].fadeOut();
	    };
	
	    // Update ---------------------------------------
	    this.updateClientList = function (clientData) {
	        cache_client = clientData;
	        _renderClient(clientData);
	    };
	
	    this.updateObList = function (obData) {};
	
	    this.updateGame = function (gameData) {
	        cache_game = gameData;
	    };
	    // api -------------------------------------------
	    this.getSetupPara = function () {
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
	            //$.get('/Host/Start');
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
/* 4 */
/*!************************************!*\
  !*** ./src/host/less/Prepare.less ***!
  \************************************/
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/*!************************************!*\
  !*** ./src/host/js/Render.Main.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	var Style = __webpack_require__(/*! ../less/Main.less */ 9);
	
	var HTML = {
	    player: '<div class="_player"></div>',
	    board: '<div class="_board"></div>'
	};
	
	var Main = function (container) {
	    var width = 0,
	        height = 0;
	    var cache_pos = null;
	    var html = {
	        container: $(container),
	        board: null,
	        player: []
	    };
	
	    // callback ------------------------------------------
	    this.onSetuped = null; // ()
	
	    // interface controll --------------------------------
	    this.show = function () {
	        html['container'].fadeIn();
	        _render();
	    };
	
	    this.hide = function () {
	        html['container'].fadeOut();
	    };
	
	    // update ---------------------------------------------
	    this.reset = function (setupData) {
	        if (setupData == null) return;
	        var player = setupData.player;
	        var color = setupData.color;
	        cache_pos = setupData.playerPos;
	        for (var i = 0; i < player.length; i++) {
	            _addPlayer(i, player[i].name, color);
	        }
	        _render();
	    };
	
	    this.updateClientList = function (clientData) {};
	
	    this.updateObList = function (obData) {
	        // deprecated
	    };
	
	    this.updateGame = function (gameData) {
	        if (gameData == null) return;
	        cache_pos = gameData.pos;
	        _render();
	    };
	
	    // game ------------------------------------------------
	    this.pause = function () {};
	    this.continue = function () {};
	
	    // private ---------------------------------------------
	    var _render = function () {
	        width = html['board'].width();
	        height = html['board'].height();
	        for (var i = 0; i < cache_pos.length; i++) {
	            var pos = cache_pos[i];
	            html['player'][i][0].style.left = pos[0] / 100 * width + 'px';
	            html['player'][i][0].style.top = pos[1] / 100 * height + 'px';
	        }
	    };
	
	    var _addPlayer = function (idx, name, color) {
	        var playerNode = $(HTML.player).appendTo(html['board']).text(name);
	        playerNode[0].style.backgroundColor = color;
	        html['player'][idx] = playerNode;
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
/* 9 */
/*!*********************************!*\
  !*** ./src/host/less/Main.less ***!
  \*********************************/
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 10 */,
/* 11 */
/*!***********************************!*\
  !*** ./src/host/js/Render.End.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	var Style = __webpack_require__(/*! ../less/End.less */ 12);
	
	var End = function () {
	    var html_wrap = $('.end'),
	        isShown = false,
	        html_content = null,
	        html_renew = null;
	
	    // interface controll --------------------------------
	    this.show = function () {
	        isShown = true;
	        html_wrap.fadeIn();
	    };
	
	    this.hide = function () {
	        isShown = false;
	        html_wrap.fadeOut();
	    };
	
	    // Update ---------------------------------------
	    this.updateClientList = function (clientData) {};
	
	    this.updateObList = function (obData) {};
	
	    this.updateGame = function (gameData) {
	        if (gameData && gameData.end) {
	            var s = "";
	            for (var i in gameData.end) {
	                s += gameData.end[i].name + " : " + (gameData.end[i].win ? 'WIN' : 'LOST') + "<br/>";
	            }
	            html_content.html(s);
	        }
	    };
	
	    // Private ---------------------------------------
	    var _setupHtml = function () {
	        html_content = $('<div class="_content">[END]</div>').appendTo(html_wrap);
	        html_renew = $('<div class="_renew">RENEW</div>').appendTo(html_wrap);
	        html_renew.click(function () {
	            $.get('/Host/Renew');
	        });
	    };
	
	    var _init = function () {
	        _setupHtml();
	    }();
	};
	
	module.exports = End;

/***/ },
/* 12 */
/*!********************************!*\
  !*** ./src/host/less/End.less ***!
  \********************************/
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 13 */,
/* 14 */
/*!**********************************!*\
  !*** ./src/host/less/Index.less ***!
  \**********************************/
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);
//# sourceMappingURL=host.js.map