﻿var Style = require('../less/Prepare.less');

var HTML = {
    playerList: '<div class="_playerList"></div>',
    item: '<div class="_item"></div>',
    colorSelector: '<div class="colorSelector"><span></span></div>',
    colorList: '<div class="_colorList"></div>',
    startBtn: '<div class="_start">START</div>'
};

var CSS = {
    occupied: '_occupied',
    hidden: '_hidden'
};

var Prepare = function (container, opts_in) {
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

        // flag
        isShown = false,

        // cache
        cache_client = null,
        cache_ob = null,
        cache_game = null;

    // Callback -------------------------------------

    // interface controll --------------------------------
    this.show = function () {
        isShown = true;
        _renderClient(cache_client);
        html['container'].fadeIn();
    };

    this.hide = function () {
        isShown = false;
        html['container'].fadeOut();
    };

    // Update ---------------------------------------
    this.updateClientList = function (clientData) {
        cache_client = clientData;
        _renderClient(clientData);
    };

    this.updateObList = function (obData) {
    };

    this.updateGame = function (gameData) {
        cache_game = gameData;
    };
    // api -------------------------------------------
    this.getSetupPara = function () {
        return {
            color: colorOption[colorId]
        };
    };

    // Private ---------------------------------------
    var _renderClient = function (clientData) {
        if (clientData == null) return;
        // player
        var occupiedNumber = {};
        for (var id in clientData) {
            if (clientData[id].number == -1) continue;
            occupiedNumber[clientData[id].number] = id;
        }

        for (var i = 0; i < maxPlayer; i++) {
            if (i in occupiedNumber) {
                html['player'][i].html(clientData[occupiedNumber[i]].name).addClass(CSS.occupied);
            } else {
                html['player'][i].html("").removeClass(CSS.occupied);
            }
        }
    };

    var _selectColor = function (id) {
        colorId = id;
        html['colorSelector'].children('span').text(id);
        html['colorSelector'][0].style.backgroundColor = colorOption[id];
    };

    // Setup -----------------------------------------
    var _setupHtml = function () {
        // player list
        html['playerList'] = $(HTML.playerList).appendTo(html['container']);
        for (var i = 0; i < maxPlayer; i++) {
            html['player'][i] = $(HTML.item).appendTo(html['playerList']);
        }

        // start btn
        html['startBtn'] = $(HTML.startBtn).appendTo(html['container']);
        html['startBtn'].click(function () {
            $.get('/Host/Start');
        });

        // color selector
        html['colorSelector'] = $(HTML.colorSelector).appendTo(html['container']);
        html['colorList'] = $(HTML.colorList).appendTo(html['colorSelector']).addClass(CSS.hidden);
        for (var i in colorOption) {
            var ele = $(HTML.item).text(i).appendTo(html['colorList']);
            ele[0].style.backgroundColor = colorOption[i];
            if (colorId == null) _selectColor(i);
            ele.click({ id: i }, function (e) {
                _selectColor(e.data.id);
            });
            html['colorItem'][i] = ele;
        }
        html['colorSelector'].click(function () {
            html['colorList'].toggleClass(CSS.hidden);
        });
    };

    var _init = function (opts_in) {
        maxPlayer = opts_in.maxPlayer;
        colorOption = opts_in.colorOption || {};
        _setupHtml();
    }(opts_in);
};

module.exports = Prepare;
