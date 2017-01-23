const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain
const app = electron.app
const globalShortcut = electron.globalShortcut

//const fs = require('fs')
// const zmq = require('zeromq')

var net = require('net');

var HOST = '127.0.0.1';
var PORT = 6969;


// var responder = zmq.socket('rep')  // server for  connecting to external messages
// var requester = zmq.socket('req')  // client that connects to external server

app.on('ready', function() {

  var prefsWindow;
  /*Create various overlay windows based on payload */
  overlayReqHandler = function(payload) {

     opts = JSON.parse(payload).RenderingOptions;

     console.log("Received data", opts);

     if (opts.Command === "close") {
       if (prefsWindow) {
         if (prefsWindow.isVisible()){
           prefsWindow.hide()
           return;
         }
       } else {
         return;
       }
     }

     if (prefsWindow) {
       if(!prefsWindow.isVisible()){
         prefsWindow.show();
         return;
       }
     }

     prefsWindow = new BrowserWindow({
        width  : opts.size.width,
        height : opts.size.height,
        show   : false,
        frame  : false,
        backgroundColor: '#ababab'
     });

     prefsWindow.loadURL('file://'+__dirname + '/../'+opts.RenderFile);

     prefsWindow.webContents.send("update-scaffold",opts);

     prefsWindow.on('focus', function(){
        console.log("pref window showed up")

        globalShortcut.register('Tab', function () {
            prefsWindow.toggleDevTools();
        });

        // globalShortcut.register('Up', function () {
        //     console.log("Pressed Up");
        //     prefsWindow.webContents.send("update-value","Up")
        // });
        //
        // globalShortcut.register('Down', function () {
        //     console.log("Pressed Down");
        //     prefsWindow.webContents.send("update-value","Down")
        // });
     });

     prefsWindow.on('blur',function(){
        console.log("pref window hidden");
        globalShortcut.unregister("Up");
        globalShortcut.unregister("Down");
        globalShortcut.unregister("Tab");
        console.log("Unregisterd key bindings");
     });

     globalShortcut.register('Cmd+Shift+Esc', function () {
          console.log("Pref toggle hit");
          if (prefsWindow.isVisible()) {
             prefsWindow.setSize(0,0,true);
             prefsWindow.hide();
          } else {
            if (prefBounds) {
              console.log("Pref win bounds",prefBounds);
              prefsWindow.setSize(prefBounds.width,prefBounds.height,true);
              prefsWindow.show();
            } else {
              prefsWindow.show();
              prefBounds = prefsWindow.getBounds();
              console.log("Registered Pref bounds",prefBounds);
            }
            console.log("connecting to port 5556");
            requester.connect("tcp://localhost:5556");
         }
      });
      prefsWindow.show();
      prefBounds = prefsWindow.getBounds();
  };

  net.createServer(function(sock) {
      // We have a connection - a socket object is assigned to the connection automatically
      console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

      sock.on('data',(data)=>{
        overlayReqHandler(data)
      });

      sock.on('close', function(data) {
          console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
      });

  }).listen(PORT, HOST);

  console.log('TCP Server listening on ' + HOST +':'+ PORT);

  // responder.bind('tcp://*:5555', function(err) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log("0MQ socket listening on 5555…")
  //   }
  // });

  //  var circularPrefsWindow = new BrowserWindow({
  //      transparent:true,
  //      frame  : false,
  //      width  : 350,
  //      height : 350
  //  })
   //
  //  circularPrefsWindow.loadURL('file://'+__dirname + '/circularPrefs.html')
   //
  //  circularPrefsWindow.show()

  ipcMain.on("update-done", function(event,arg1,arg2){
       console.log(arg1,arg2)

       if (arg1 == "Up" || arg1 == "Down") {
         console.log("Rendering update done via user interaction")
         //requester.send(arg2)
       } else {
          console.log("Rendering update done via external message")
          //responder.send(arg1)
      }
   });

  //  responder.on('message', function(request) {
  //    console.log("Received request: [", request.toString(), "]")
  //    console.log("Sending to renderer")
  //    prefsWindow.webContents.send("update-value",request.toString())
  //  })

  //  requester.on('message', function(arg){
  //    console.log("Received ack from external entity:", arg.toString())
  //  });
})

process.on('SIGINT', function() {
  //requester.close();
});
