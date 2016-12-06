var Core = function () {
    // property -----------------------------------------------
    var that = this,
        start = false,
        msg = null,
        _map = null,
        _players = null,
        _playersId = null,
        _playerMap = null;

    // message -----------------------------------------------
    this.send = null;   // (code, content)

    this.receive = function (msg) {
    };

    this.action = function (clientId, dat) {
        if (!start) return;
        msg = _players[_playerMap[clientId]].name + ":<b> " + dat.dat + " (" + (Date.now() - dat.time) + " ms)</b>";

        if (dat.dat == "END") {
            var p = {};
            for (var i in _playerMap) {
                p[_players[_playerMap[i]].id] = { name: _players[_playerMap[i]].name, win: false };
            }
            p[_players[_playerMap[clientId]].id].win = true;
            this.onUpdated({ end: p });
            for (var i = 0; i < _players.length; i++) {
                this.clientUpdate([_players[i].id], {
                    rst: p[_players[i].id].win
                });
            }
            $.get('/Host/End')
        } else {
            this.onUpdated({ msg: msg });
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
            _map = setupData.map;
        }
        if (gameData != null) {
            msg = gameData.msg;
        }
    };

    this.setup = function (playerData, para) {
        _players = [];
        _playersId = [];
        _playerMap = {};
        _map = para.map;

        for (var i = 0, count = playerData.length; i < count; i++) {
            if (playerData[i] == null) continue;
            _players.push(playerData[i]);
            _playersId.push(_players[i].id);
            _playerMap[_players[i].id] = i;
        }

        this.onSetuped({
            playerMap: _playerMap,
            player: _players,
            playerId: _playersId,
            map: _map
        });
        for (var i = 0; i < _players.length; i++) {
            this.clientSetup([_players[i].id], {
                id: i,
                current:-1,
                map: _map
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
        _map = null;
        _players = null;
        _playerMap = null;
    };
    this.pause = function () { };
    this.continue = function () { };

    // setup -----------------------------------------------
    var _init = function () {
    }();
};

module.exports = Core;
