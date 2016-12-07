var Style = require('../less/Main.less');

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
        board : null,
        player:[]
    };

    // callback ------------------------------------------
    this.onSetuped = null;      // ()

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
        if (setupData==null) return;
        _clear();
        var player = setupData.player;
        var color = setupData.color;
        cache_pos = setupData.playerPos;
        for (var i=0;i<player.length;i++){
            _addPlayer(i, player[i].name, color);
        }
        _render();
    };

    this.updateClientList = function (clientData) {
    };

    this.updateObList = function (obData) {
      // deprecated
    };

    this.updateGame = function (gameData) {
        if (gameData == null) return;
        cache_pos = gameData.pos;
        _render();
    };

    // game ------------------------------------------------
    this.pause = function () { };
    this.continue = function () { };

    // private ---------------------------------------------
    var _clear = function (){
        html['board'].empty();
        html['player']=[];
    };
    var _render = function (){
        width = html['board'].width();
        height = html['board'].height();
        for (var i=0;i<cache_pos.length;i++){
            var pos = cache_pos[i];
            html['player'][i][0].style.left = pos[0]/100*width+'px';
            html['player'][i][0].style.top = pos[1]/100*height+'px';
        }
    };

    var _addPlayer = function (idx, name, color){
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
