Rendxx = Rendxx || {};
Rendxx.Game = Rendxx.Game || {};
Rendxx.Game.Test = Rendxx.Game.Test || {};
Rendxx.Game.Test.Client = Rendxx.Game.Test.Client || {};

(function (Client) {
    var _Data = {
    };

    var ControlPad = function (opts_in) {
        // Property -----------------------------------------------
        var that = this,
            started = false,
            html_wrap = $('.controller'),
            html_info = null,
            btns = {},
            info = [],
            setup_info = null,
            isWin = false;

        // message -----------------------------------------------
        this.action = null;     // (content)

        this.send = null;       // (code, content)

        this.receive = function (msg) {
        };

        // update ---------------------------------------------
        // reset game with given data
        this.reset = function (setupData) {
            this.setup(setupData);
        };

        this.setup = function (setupData) {
            if (setupData == null || setup_info!=null) return;
            setup_info = JSON.stringify(setupData);
            html_info.html("[setup] " + setup_info);
        };

        this.update = function (dat) {
            if (dat == null) return;
            if (dat.hasOwnProperty('rst')) {
                isWin = dat.rst;
            } else {
                html_info.html("[setup] " + setup_info + "<br/>" + JSON.stringify(dat));
            }
        };

        // game ---------------------------------------------------
        this.start = function () {
            started = true;
            info[0].hide();
            for (var i in btns) btns[i].show();
        };
        this.end = function () {
            started = false;
            for (var i in btns) btns[i].hide();
            info[1].show({ content: '<div class="_midText">'+(isWin?'WIN':'LOST')+'</div>' });
        };
        this.renew = function () {
            started = true;
            setup_info = null;
            html_info.html("");
            info[0].show();
            info[1].hide();
        };
        this.pause = function () {
        };
        this.continue = function () {
        };

        // Get Data -----------------------------------------------
        // Setup -----------------------------------------------
        var _setupController = function () {
            html_info = $('<div class="client-info"></div>').appendTo(html_wrap);
            btns = {};

            ch = 'A';
            btns[ch] = addBtn(ch, '0%', '0%', '#5F90B0');
            ch = 'B';
            btns[ch] = addBtn(ch, '50%', '0%', '#94B177');
            ch = 'C';
            btns[ch] = addBtn(ch, '0%', '50%', '#CCA976');
            ch = 'END';
            btns[ch] = addBtn(ch, '50%', '50%', '#552929');

            info[0] = addInfo(0, '<div class="_midText">Waiting for start</div>');
            info[1] = addInfo(1, null);
        };

        var addBtn = function (ch, top, left, color) {
            var btn = new Rendxx.Game.Client.Controller.Button({
                container: html_wrap,
                css: {
                    'z-index': 20,
                    'height': '50%',
                    'width': '50%',
                    'top': top,
                    'left': left
                },
                cssHandler: {
                    'background-color': color
                },
                text: ch
            });

            btn.onTap = function (data) {
                if (!started) return;
                that.action({ dat: ch, time: Date.now() });
            };

            btn.hide();
            return btn;
        };

        var addInfo = function (idx, content) {
            var info = new Rendxx.Game.Client.Controller.Info({
                container: html_wrap,
                css: {
                    'z-index':'10',
                    'background-color': '#333'
                },
                content: content
            });
            info.hide();
            return info;
        };

        var _init = function (opts_in) {
            _setupController();
        }(opts_in);
    };
    Client.ControlPad = ControlPad;
})(Rendxx.Game.Test.Client);