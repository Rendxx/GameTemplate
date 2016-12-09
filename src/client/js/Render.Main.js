/* TODO:
    Main-Screen is the main screen.
    It renders the game.
*/

﻿var Style = require('../less/Main.less');

var HTML = {
    btnWrap: '<div class="_btnWrap"></div>',
    btn: '<div class="_btn"></div>',
    info: '<div class="_info"></div>',
};

var CSS = {
    top: '_top',
    bottom: '_bottom',
    left: '_left',
    right: '_right'
};

var Main = function (container) {
    "use strick";
    // Property -------------------------------------
    var // html
        html = {
            container: $(container),
            btnWrap: null,
            info: null,
            btn: {}
        },

        // data
        currentPlayer = 0;

    // Callback -------------------------------------
    this.message = {};        /* TODO: this is a package of message hander. this.message.action(dat),  this.message.send(dat) */

    // interface controll --------------------------------
    this.show = function () {
        /* TODO: show Prepare-Screen */
        _showMsg();
        html['container'].fadeIn();
    };

    this.hide = function () {
        /* TODO: hide Prepare-Screen */
        html['container'].fadeOut();
    };

    // Update ---------------------------------------
    this.reset = function (setupData) {
        /* TODO: initialize the game */
    };

    this.updateGame = function (gameData) {
        /* TODO: do nothing */
    };

    // Private ---------------------------------------
    var _showMsg = function (clientData) {
    };

    // Setup -----------------------------------------
    var _setupHtml = function () {
    };

    var _init = function () {
        _setupHtml();
    }();
};

module.exports = Main;
