/**
 * Archivo encargado de guardar las configuraciones para la creación de la ventana por Electron
 */

const {app, BrowserWindow} = require('electron')
//Declaración del Servidor mediante Express mediante la llamada del archivo app.js
//archivo cuyo codigo tiene la información necesaria para ejecutar ExpressJS
const server = require('./app');

let mainWindow;

function createWindow () {

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.loadURL('http://localhost:5000')
    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('resize', function(e,x,y){
    mainWindow.setSize(x, y);
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
})