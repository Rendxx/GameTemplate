/* TODO:
    Main-Screen is the main screen.
    It renders the game.
*/

﻿var Style = require('../less/Main.less');

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
        board : null,
        player:[]
    };

    // callback ------------------------------------------
    this.handler = {};        /* TODO: this is a package of hander provided by Core. You can use these handler to control the game at Host */

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
        if (setupData==null) return;
        _clear();
        var player = setupData.player;
        var color = setupData.color;
        cache_pos = setupData.playerPos;
        for (var i=0;i<player.length;i++){
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

    var _addPlayer = function (idx, clientId, name, color){
        var playerNode = $(HTML.player).appendTo(html['board']).text(name);
        playerNode[0].style.backgroundColor = color;
        html['player'][idx] = playerNode;

        playerNode[0].addEventListener('click', function (){
            $$.info.check(name + " will win this game?", null, true, "rgba(0,0,0,0.6)",
            function () {
                that.handler.win(clientId);   // use handler to control game from HOST
            });
        },false)
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
