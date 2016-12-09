/* TODO:
    Prepare-Screen is the screen before game starting.
    You can set game options while waiting for other players.
*/

var Style = require('../less/Prepare.less');

var HTML = {
    nameTag: '<div class="_nameTag"></div>',
    waiting: '<div class="_waiting">waiting</div>'
};

var Prepare = function (container, opts_in) {
    "use strick";
    // Property -------------------------------------
    var // html
        html = {
            container: $(container),
            nameTag: null,
            waiting: null
        },

        // data
        clientName = '';

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
    };

    // Private ---------------------------------------

    // Setup -----------------------------------------
    var _setupHtml = function () {
        html['nameTag'] = $(HTML.nameTag).appendTo(html['container']).text(clientName);
        html['waiting'] = $(HTML.waiting).appendTo(html['container']);
    };

    var _init = function (opts_in) {
        clientName = opts_in.name;
        _setupHtml();
    }(opts_in);
};

module.exports = Prepare;
