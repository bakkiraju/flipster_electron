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

responder.bind('tcp://*:5555', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Listening on 5555…");
  }
});

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

   prefsWindow.on('focus',function(){
     globalShortcut.register('Up', function () {
           console.log("Pressed Up");
          prefsWindow.webContents.send("update-value","Up");
     });

     globalShortcut.register('Down', function () {
       console.log("Pressed Down");
          prefsWindow.webContents.send("update-value","Down");
     });
   })

   prefsWindow.on('blur',function(){
     globalShortcut.unregister("Up")
     globalShortcut.unregister("Down")
   })

   ipc.on('toggle-window', function (event) {
      if (prefsWindow.isVisible())
        prefsWindow.hide()
      else
        prefsWindow.show()
   })

   ipc.on("update-done", function(arg){
     console.log("Preferences update done")
     responder.send("done")
   })

   responder.on('message', function(request) {
     console.log("Received request: [", request.toString(), "]");

     prefsWindow.webContents.send("update-value",request);
   });
})

process.on('SIGINT', function() {
  requester.close();
});
