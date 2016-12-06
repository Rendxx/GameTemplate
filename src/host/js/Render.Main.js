Rendxx = Rendxx || {};
Rendxx.Game = Rendxx.Game || {};
Rendxx.Game.Test = Rendxx.Game.Test || {};
Rendxx.Game.Test.Host = Rendxx.Game.Test.Host || {};
Rendxx.Game.Test.Host.Render = Rendxx.Game.Test.Host.Render || {};

(function (Render) {
    var Main = function () {
        var html_wrap = $('.main'),
            html_title = null,
            html_content = null;

        // callback ------------------------------------------
        this.onSetuped = null;      // ()

        // interface controll --------------------------------
        this.show = function () {
            html_content.empty();
            html_wrap.fadeIn()
        };

        this.hide = function () {
            html_wrap.fadeOut()
        };

        // update ---------------------------------------------
        this.reset = function (setupData) {

        };

        this.updateClientList = function (clientData) {
        };

        this.updateObList = function (obData) {
        };

        this.updateGame = function (gameData) {
            if (gameData == null) return;
            html_content.append('<div class="_item">'+gameData.msg+'</div>');
        };

        // game ------------------------------------------------
        this.pause = function () { };
        this.continue = function () { };

        // setup -----------------------------------------------
        var _setupHtml = function () {
            html_title = $('<div class="_title">GAME MAIN</div>').appendTo(html_wrap);
            html_content = $('<div class="_content"></div>').appendTo(html_wrap);
        };

        var _init = function () {
            _setupHtml();
        }();
    };
    Render.Main = Main;
})(Rendxx.Game.Test.Host.Render);