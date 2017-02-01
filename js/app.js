const electron = require('electron');

const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain
const app = electron.app
const globalShortcut = electron.globalShortcut

electron.app.on('browser-window-created', function(e, window) {
    window.setMenu(null);
});

app.on('ready', function() {

    var prefsWindow;
    var opts;

    prefsWindow = new BrowserWindow({
        name: "OverlayWindow",
        'node-integration': false,
        transparent: true,
        frame: false,
        show: false,
        width: 800,
        height: 300,
        x:178,
        y:1600
    });

   prefsWindow.loadURL('file://' + __dirname + '/../prefs.html');

    //  prefsWindow.setAlwaysOnTop(true);
    //  prefsWindow.setIgnoreMouseEvents(true);

    overlayReqHandler = function(payload) {
       console.time('init');
        prefsWindow.show()
        console.timeEnd("init");
    };

    overlayReqHandler(null);
})

process.on('SIGINT', function() {
});
