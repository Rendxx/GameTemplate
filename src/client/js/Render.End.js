/* TODO:
    End-Screen is the screen after game end.
    Show the game result in this screen.
*/﻿

﻿var Style = require('../less/End.less');

var HTML = {
    result: '<div class="_result"><span></span></div>'
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
            result: null
        };

    // Callback -------------------------------------

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
    this.updateGame = function (gameData) {
        /* TODO: do nothing */
        if (gameData==null) return;
        var win = gameData.end;
        if (win){
            html['result'].addClass(CSS.win);
            html['result'].children('span').text('WIN');
        }else{
            html['result'].removeClass(CSS.win);
            html['result'].children('span').text('LOSE');
          }
    };

    // Private ---------------------------------------

    // Setup -----------------------------------------
    var _setupHtml = function () {
        html['result'] = $(HTML.result).appendTo(html['container']);
    };

    var _init = function () {
        _setupHtml();
    }();
};

module.exports = End;
