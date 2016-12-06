
var ClientList = function (opts_in) {
    // Property -----------------------------------------------
    var that = this,
        _max = 5,
        _isLocker = false,
            obCount = 0;

    var clients = {},       // { id:<number>, name:<string>, number:<number>}
        obs = {},           // { id:<number>, name:<string>, number:<number>}
        players = [];       // queue of players, starts from 0

    // callback ------------------------------------------
    this.onUpdateClient = null;
    this.onUpdateOb = null;

    // API -----------------------------------------------
    // reset game with given data
    this.reset = function (clientData, obData) {
        clients = {};
        obs = {};
        players = [];
        for (var i = 0; i < _max; i++) players[i] = null;
        for (var id in clientData) {
            addClient(id, clientData[id]);
        }
        for (var id in obData) {
            addOb(id, obData[id]);
        }
        if (this.onUpdateClient) this.onUpdateClient(clients);
        if (this.onUpdateOb) this.onUpdateOb(obs);
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

    // refresh client list
    this.updateObList = function (obData) {
        for (var id in obs) {
            if (id in obData) continue;
            removeOb(id);
        }
        for (var id in obData) {
            if (id in obs) continue;
            addOb(id, obData[id]);
        }
        if (this.onUpdateOb) this.onUpdateOb(obs);
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
                    id:id
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

    var addOb = function (id, name) {
        obs[id] = {
            id: id,
            name: name,
            number: obCount++
        };
    };

    var removeOb = function (id) {
        delete obs[id];
    };

    // Setup -----------------------------------------------
    var _init = function (opts_in) {
        _max = opts_in.max;
        for (var i = 0; i < _max; i++) players[i] = null;
    }(opts_in);
};

module.exports = ClientList;
