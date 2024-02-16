const {app, BrowserWindow} = require('electron');  
const url = require('url');
const path = require('path');   
	
function onReady () {     
	win = new BrowserWindow({width: 1440, height: 1024})    
	win.loadURL(url.format({      
		pathname: path.join(
			__dirname,
			'dist/belligerance/index.html'),       
		protocol: 'file:',      
		slashes: true     
	}))
}
app.on('ready', onReady);