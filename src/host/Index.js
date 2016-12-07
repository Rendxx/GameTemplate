/* TODO:
    Fetch all modules and put them into a global object.
    Then we can use them in Host.html.
*/

var Style = require('./less/Index.less');

window.GAME = {
  ClientList:require('./js/ClientList.js'),
  Core:require('./js/Core.js'),
  Render:{
    Prepare : require('./js/Render.Prepare.js'),
    Main : require('./js/Render.Main.js'),
    End : require('./js/Render.End.js')
  }
};
