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
    var that = this;
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
        html['container'].fadeIn();
    };

    this.hide = function () {
        /* TODO: hide Prepare-Screen */
        html['container'].fadeOut();
    };

    // Update ---------------------------------------
    this.reset = function (setupData) {
        /* TODO: initialize the game */
        _showMsg('reset');
    };

    this.updateGame = function (gameData) {
        /* TODO: receive update data from Host */
        if (gameData==null) return;
        _showMsg('current: '+gameData.current);
    };

    // Private ---------------------------------------
    var _showMsg = function (msg) {
        html['info'].text(msg);
    };

    var _move = function (x,y) {
        that.message.action([x,y]);
    };

    // Setup -----------------------------------------
    var _setupHtml = function () {
        html['btnWrap'] = $(HTML.btnWrap).appendTo(html['container']);
        html['info'] = $(HTML.info).appendTo(html['container']);
        html['btn'].top = $(HTML.btn).appendTo(html['btnWrap']).addClass(CSS.top).text('Y +');
        html['btn'].bottom = $(HTML.btn).appendTo(html['btnWrap']).addClass(CSS.bottom).text('Y -');
        html['btn'].left = $(HTML.btn).appendTo(html['btnWrap']).addClass(CSS.left).text('X -');
        html['btn'].right = $(HTML.btn).appendTo(html['btnWrap']).addClass(CSS.right).text('X +');

        html['btn'].top.click(function(){_move(0,10);});
        html['btn'].bottom.click(function(){_move(0,-10);});
        html['btn'].left.click(function(){_move(-10,0);});
        html['btn'].right.click(function(){_move(10,0);});
    };

    var _init = function () {
        _setupHtml();
    }();
};

module.exports = Main;
