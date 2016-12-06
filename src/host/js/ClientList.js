
var ClientList = function (opts_in) {
    // Property -----------------------------------------------
    var that = this,
        _max = 5,
        _isLocker = false;

    var clients = {},       // { id:<number>, name:<string>, number:<number>}
        players = [];       // queue of players, starts from 0

    // callback ------------------------------------------
    this.onUpdateClient = null;
    this.onUpdateOb = null;   // deprecated

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

    // Setup -----------------------------------------------
    var _init = function (opts_in) {
        _max = opts_in.max;
        for (var i = 0; i < _max; i++) players[i] = null;
    }(opts_in);
};

module.exports = ClientList;
