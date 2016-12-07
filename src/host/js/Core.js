var Core = function () {
    // property -----------------------------------------------
    var that = this,
        start = false,
        _color = null,
        _players = null,
        _playersId = null,
        _playerMap = null,
        _playerPos = [];

    // message -----------------------------------------------
    this.send = null;   // (code, content)

    this.receive = function (msg) {
    };

    this.action = function (clientId, dat) {
        if (!start) return;

        if (dat == "END") {
            var p = [];
            for (var i = 0; i < _players.length; i++) {
                p[i]  = { id: _players[i].id, name: _players[i].name, win: false };
            }
            p[_playerMap[clientId]].win = true;
            this.onUpdated({
              end: p,
              pos: _playerPos
            });
            for (var i = 0; i < _players.length; i++) {
                this.clientUpdate([_players[i].id], {
                    end: p[i].win
                });
            }
            window.test.end();
            //$.get('/Host/End')
            start=false;
        } else {
            var pos = _playerPos[_playerMap[clientId]];
            pos[0]= Math.max(0, Math.min(100,pos[0]+dat[0]));
            pos[1]= Math.max(0, Math.min(100,pos[1]+dat[1]));

            this.onUpdated({ pos: _playerPos });
            this.clientUpdate(_playersId, {
                current: _playerMap[clientId]
            });
        }
    };

    // callback ------------------------------------------
    this.onUpdated = null;      // (gameData)
    this.onSetuped = null;      // (setupData)
    this.clientSetup = null;    // (target, clientData)
    this.clientUpdate = null;   // (target, clientData)

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
    this.pause = function () { };
    this.continue = function () { };

    // setup -----------------------------------------------
    var _init = function () {
    }();
};

module.exports = Core;
