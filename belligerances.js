const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const url = require('url');
const path = require('path');

function onReady() {
  var fenetre = new BrowserWindow({
    width: 1620, height: 1024,
    icon: 'prod/browser/assets/android-chrome-192x192.png',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true, // Allows IPC and other APIs,
      contextIsolation: false
    }
  });
  // fenetre.loadURL('http://localhost:4200');
  fenetre.loadURL(url.format({
    pathname: path.join(__dirname, 'prod/browser/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  fenetre.setTitle(`Belligérances`);

  // Contenu prêt, on envoie les infos du path pour l'appli
  fenetre.webContents.on('dom-ready', ()=>{
    fenetre.webContents.send('start', app.getPath('userData'));
  });

  ipcMain.on('start', (event, arg) => {
    console.log("Démarrage");
    console.log(event);
    console.log(arg);
    fenetre.webContents.send('start');
  });
  ipcMain.on('close', (event, arg) => {
    console.log("Fermer la fenêtre de l'application");
    console.log(event);
    console.log(arg);
    fenetre.webContents.send('ecoute', 'Je te dis un truc');
  });
  /** ajouter des raccourcis */
  globalShortcut.register('CommandOrControl+q', () => {
    app.quit();
  });
  // ajouter des raccourcis
  globalShortcut.register('CommandOrControl+d', () => {
    fenetre.webContents.openDevTools();
  })
  // ajouter des raccourcis
  globalShortcut.register('CommandOrControl+(', () => {
    fenetre.webContents.reloadIgnoringCache()
  })
}
app.on('ready', onReady);
app.on("window-all-closed", () => { app.quit() });
