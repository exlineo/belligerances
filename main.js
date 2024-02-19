const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');

function onReady() {
  win = new BrowserWindow({ width: 1440, height: 1024 });
  win.loadURL(url.format({
    pathname: path.join(
      __dirname,
      'prod/browser/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  win.webContents.openDevTools();
}
app.on('ready', onReady);
