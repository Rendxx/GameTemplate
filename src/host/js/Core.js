/* TODO:
    This is the primary part of this game.
    - It setups the game with initial options and create setup data.
    - It receives and run user's operation.
    - It keeps sending game data to renderer, server and clients.
    - It monitors game process and decides the next status of the game.
*/﻿

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
    this.send = null;         /* TODO: this.send(code, content): This function should be set by Host-Manager, it is used to send message out */
    this.handler = {};        /* TODO: this is a package of hander for Render.Main */

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
        pos[0]= Math.max(0, Math.min(100,pos[0]+dat[0]));
        pos[1]= Math.max(0, Math.min(100,pos[1]+dat[1]));

        this.onUpdated({ pos: _playerPos });
        this.clientUpdate(_playersId, {
            current: _playerMap[clientId]
        });
    };

    // callback ------------------------------------------
    this.onUpdated = null;      // (gameData): becalled when game updates
    this.onSetuped = null;      // (setupData): be called when game setups
    this.clientSetup = null;    // (target, clientData) setup client, be called when game setups
    this.clientUpdate = null;   // (target, clientData) update client side, be called when anything related to that client updates

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

            var playerObj={
              id: playerData[i].id,
              name: playerData[i].name
            }
            _players.push(playerObj);
            _playersId.push(playerObj.id);
            _playerMap[playerObj.id] = i;
            _playerPos.push([~~(Math.random()*100), ~~(Math.random()*100)]);
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
                current:-1
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
            p[i]  = { id: _players[i].id, name: _players[i].name, win: false };
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
        start=false;
    };

    // setup -----------------------------------------------
    var _init = function () {
        that.handler.win = win;
    }();
};

module.exports = Core;
