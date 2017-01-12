const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const MenuItem = electron.MenuItem
const ipcMain = electron.ipcMain
const app = electron.app
const globalShortcut = electron.globalShortcut

const fs = require('fs')

const zmq = require('zeromq')


var responder = zmq.socket('rep')  // server for  connecting to external messages
var requester = zmq.socket('req')  // client that connects to external server


app.on('ready', function() {

  responder.bind('tcp://*:5555', function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Listening on 5555…")
    }
  });

   var prefsWindow = new BrowserWindow({
       width  : 400,
       height : 300,
       show   : false,
       frame  : false,
       backgroundColor: '#ababab'
   })

   var prefBounds;

   prefsWindow.loadURL('file://'+__dirname + '/prefs.html')

   globalShortcut.register('Tab', function () {
      prefsWindow.toggleDevTools();
   });

   globalShortcut.register('Esc', function () {
     console.log("Pref toggle hit");
      if (prefsWindow.isVisible()) {
        prefsWindow.setSize(0,0,true);
        prefsWindow.hide();
      } else {
        if (prefBounds) {
          console.log("Pref win bounds",prefBounds);
          prefsWindow.setSize(prefBounds.width,prefBounds.height,true)
          prefsWindow.show();
        } else {
          prefsWindow.show();
          prefBounds = prefsWindow.getBounds();
          console.log("Registered Pref bounds",prefBounds);
        }
        console.log("connecting to port 5556")
        requester.connect("tcp://localhost:5556")
      }
   });

  prefsWindow.on('focus', function(){
     console.log("pref window showed up")
     globalShortcut.register('Up', function () {
         console.log("Pressed Up");
         prefsWindow.webContents.send("update-value","Up")
     });

     globalShortcut.register('Down', function () {
          console.log("Pressed Down");
             prefsWindow.webContents.send("update-value","Down")
     });
  });

  prefsWindow.on('blur',function(){
     console.log("pref window hidden")
     globalShortcut.unregister("Up")
     globalShortcut.unregister("Down")
     console.log("Unregisterd key bindings")
   });

  ipcMain.on("update-done", function(event,arg1,arg2){
       console.log(arg1,arg2)

       if (arg1 == "Up" || arg1 == "Down") {
         console.log("Rendering update done via user interaction")
         requester.send(arg2)
       } else {
          console.log("Rendering update done via external message")
          responder.send(arg1)
      }
   })

   responder.on('message', function(request) {
     console.log("Received request: [", request.toString(), "]")
     console.log("Sending to renderer")
     prefsWindow.webContents.send("update-value",request.toString())
   })

   requester.on('message', function(arg){
     console.log("Received ack from external entity:", arg.toString())
   })
})

process.on('SIGINT', function() {
  requester.close();
});
