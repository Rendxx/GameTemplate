/* TODO:
    End-Screen is the screen after game end.
    Show the game result in this screen.
*/﻿

﻿var Style = require('../less/End.less');

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
        board : null,
        renew : null
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
            for (var i=0;i<end.length;i++){
                _addPlayer(end[i].name, end[i].win);
            }
        }
    };

    // Private ---------------------------------------
    var _addPlayer = function (name, win){
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
