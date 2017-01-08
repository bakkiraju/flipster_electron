const electron = require('electron')

const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const MenuItem = electron.MenuItem
const ipc = electron.ipcMain
const app = electron.app
const globalShortcut = electron.globalShortcut

const menu = new Menu()
menu.append(new MenuItem({ label: 'Hello' }))
menu.append(new MenuItem({ type: 'separator' }))
menu.append(new MenuItem({ label: 'Electron', type: 'checkbox', checked: true }))

app.on('ready', function() {
   var mainWindow = new BrowserWindow({
       width: 800,
       height: 600,
       show : false
   })

   mainWindow.loadURL('file://' + __dirname + '/main.html')



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
     console.log("Esc hit");
      if (prefsWindow.isVisible())
        prefsWindow.hide();
      else
        prefsWindow.show();
   });


   ipc.on('toggle-window', function (event) {
      console.log("clicked me")


      if (prefsWindow.isVisible())
        prefsWindow.hide()
      else
        prefsWindow.show()
   })
})
