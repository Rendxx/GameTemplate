var Style = require('../less/End.less');

var End = function () {
    var html_wrap = $('.end'),
        isShown = false,
        html_content = null,
        html_renew = null;

    // interface controll --------------------------------
    this.show = function () {
        isShown = true;
        html_wrap.fadeIn();
    };

    this.hide = function () {
        isShown = false;
        html_wrap.fadeOut();
    };

    // Update ---------------------------------------
    this.updateClientList = function (clientData) {
    };

    this.updateObList = function (obData) {
    };

    this.updateGame = function (gameData) {
        if (gameData && gameData.end) {
            var s = "";
            for (var i in gameData.end) {
                s += gameData.end[i].name + " : " + (gameData.end[i].win?'WIN':'LOST')+"<br/>";
            }
            html_content.html(s);
        }
    };

    // Private ---------------------------------------
    var _setupHtml = function () {
        html_content = $('<div class="_content">[END]</div>').appendTo(html_wrap);
        html_renew = $('<div class="_renew">RENEW</div>').appendTo(html_wrap);
        html_renew.click(function () {
            $.get('/Host/Renew');
        });
    };

    var _init = function () {
        _setupHtml();
    }();
};

module.exports = End;
