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
    this.updateGame = function (gameData) {
        /* TODO: do nothing */
    };

    // Private ---------------------------------------
    var _renderClient = function (clientData) {
    };

    // Setup -----------------------------------------
    var _setupHtml = function () {
    };

    var _init = function () {
        _setupHtml();
    }();
};

module.exports = End;
