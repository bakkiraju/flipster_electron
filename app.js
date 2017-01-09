const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const MenuItem = electron.MenuItem
const ipc = electron.ipcMain
const app = electron.app
const globalShortcut = electron.globalShortcut
const zmq = require('zeromq')

var responder = zmq.socket('rep');
var requester = zmq.socket('req');

requester.connect("tcp://localhost:5556");

app.on('ready', function() {

   var prefsWindow = new BrowserWindow({
       width  : 400,
       height : 300,
       show   : false,
       frame  : false,
       backgroundColor: '#ababab',
       focusable: false
   })

   prefsWindow.loadURL('file://'+__dirname + '/prefs.html')

   globalShortcut.register('Tab', function () {
      prefsWindow.toggleDevTools();
   });

   globalShortcut.register('Esc', function () {
     console.log("Pref toggle hit");
      if (prefsWindow.isVisible())
        prefsWindow.hide();
      else
        prefsWindow.show();
   });

   globalShortcut.register('Up', function () {
         console.log("Pressed Up");
        prefsWindow.webContents.send("update-value","Up");
   });

   globalShortcut.register('Down', function () {
     console.log("Pressed Down");
        prefsWindow.webContents.send("update-value","Down");
   });

   ipc.on('toggle-window', function (event) {
      if (prefsWindow.isVisible())
        prefsWindow.hide()
      else
        prefsWindow.show()
   })
})

process.on('SIGINT', function() {
  requester.close();
});
