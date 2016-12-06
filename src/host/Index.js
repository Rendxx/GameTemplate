var ClientList = require('./js/ClientList.js');
var Core = require('./js/Core.js');
var Render = {
  Prepare : require('./js/Render.Prepare.js'),
  Main : require('./js/Render.Main.js'),
  End : require('./js/Render.End.js')
};

var Style = require('./less/Index.less');

window.GAME = {
  ClientList:ClientList,
  Core:Core,
  Render:Render
};
