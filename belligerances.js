const { app, BrowserWindow, ipcMain } = require('electron');
const url = require('url');
const path = require('path');

function onReady() {
  var fenetre = new BrowserWindow({
    width: 1440, height: 1024,
    icon:'src/assets/android-chrome-192x192.png',
    autoHideMenuBar: true,
    webPreferences: {
      // nodeIntegration: true, // Allows IPC and other APIs
    }
  });
  fenetre.loadURL('http://localhost:4200');
  // fenetre.loadURL(url.format({
  //   pathname: path.join(__dirname,'prod/browser/index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }));

  fenetre.webContents.openDevTools();

  ipcMain.on('close', (event, arg) => {
    console.log("Fermer la fenêtre de l'application");
    console.log(event);
    console.log(arg);
    fenetre.webContents.send('ecoute', 'Je te dis un truc');
});
}
app.on('ready', onReady);
app.on("window-all-closed", () => {app.quit()});
