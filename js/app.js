const electron = require('electron');
const net = require('net'), JsonSocket = require('json-socket');;

const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain
const app = electron.app
const globalShortcut = electron.globalShortcut

//const fs = require('fs')
// const zmq = require('zeromq')
var HOST = '127.0.0.1';
var PORT = 6969;
// var responder = zmq.socket('rep')  // server for  connecting to external messages
// var requester = zmq.socket('req')  // client that connects to external server

electron.app.on('browser-window-created', function(e, window) {
    window.setMenu(null);
});

app.on('ready', function() {

  //  var circularPrefsWindow = new BrowserWindow({
  //     name: "CirculatWindow",
  //      transparent:true,
  //      frame  : false,
  //      width  : 450,
  //      height : 450
  //  });
   //
  //  circularPrefsWindow.loadURL('file://'+__dirname + '/../circularPrefs.html');
   //
  //  circularPrefsWindow.show();

    var prefsWindow;
    var opts;

    prefsWindow = new BrowserWindow({
        name: "OverlayWindow",
        'node-integration': false,
        transparent: true,
        frame: false,
        show: false,
        width: 1000,
        height: 300,
        x:300,
        y:900
    });

   prefsWindow.loadURL('file://' + __dirname + '/../prefs.html');

    // prefsWindow.setAlwaysOnTop(true);
    // prefsWindow.setIgnoreMouseEvents(true);


    /*Create various overlay windows based on payload */
    overlayReqHandler = function(payload) {

       console.time('init');

        opts = JSON.parse(payload).RenderingOptions;

        console.log(new Date().toUTCString(), "Received data", opts);

        if (opts.Command === "close") {
            if (prefsWindow) {
                if (prefsWindow.isVisible()) {
                    prefsWindow.hide();
                }
            }
            return;
        }

        if (opts.Command === "fade-out") {
            prefsWindow.webContents.send("fade-out");
            return;
        }

        if (opts.Command === "trava-tap") {
            prefsWindow.webContents.send("trava-tap",opts);
            return;
        }

        if (opts.Command === "update-overlay-value") {
            prefsWindow.webContents.send("update-overlay-value",opts);
            return;
        }

        prefsWindow.setSize(opts.size.width, opts.size.height);
        prefsWindow.renderopts = opts;
        prefsWindow.webContents.send("update-scaffold",opts);

        // prefsWindow.once('ready-to-show', () => {
        //    console.log(new Date().toUTCString(), "update scaffold sent");
        //    prefsWindow.webContents.send("update-scaffold",opts);
        //    prefsWindow.show()
        // });

        // prefsWindow.on('dom-ready', function() {
        //    console.log("Web contents loaded");
        // });

        // prefsWindow.on('focus', function() {
        //     console.log("pref window showed up")
        //
        //     globalShortcut.register('Tab', function() {
        //         prefsWindow.toggleDevTools();
        //     });
        // });

      //prefsWindow.show();

      // prefsWindow.once('ready-to-show', () => {
        prefsWindow.show()
        console.timeEnd("init");
      // });

    };

    net.createServer(function(sock) {
        // We have a connection - a socket object is assigned to the connection automatically
        console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);

        sock.on('data', (data) => {
          console.log("UI Engine Received json", new Date().toUTCString());
          overlayReqHandler(data)
        });

        sock.on('close', function(data) {
            console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
        });

    }).listen(PORT, HOST);

    console.log('TCP Server listening on ' + HOST + ':' + PORT);

    ipcMain.on("scaffoling-loaded", function(event, arg) {
       console.log("Scaffolding got loaded",arg);
      //  prefsWindow.webContents.send("update-scaffold",opts);
    });

    ipcMain.on("update-done", function(event, arg1, arg2) {
        console.log(arg1, arg2)

        if (arg1 == "Up" || arg1 == "Down") {
            console.log("Rendering update done via user interaction")
            //requester.send(arg2)
        } else {
            console.log("Rendering update done via external message")
            //responder.send(arg1)
        }
    });
})

process.on('SIGINT', function() {
    //requester.close();
});
