/**
 * Archivo encargado de guardar las configuraciones para la creación de la ventana por Electron
 */
const path = require('path');
const {app, BrowserWindow} = require('electron');
//Declaración del Servidor mediante Express mediante la llamada del archivo app.js
//archivo cuyo codigo tiene la información necesaria para ejecutar ExpressJS
const server = require('./app');
const {exec} = require('child_process');
const datadb = require('./config/config.json')
const firstRun = require('electron-first-run');





let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        autoHideMenuBar: true,
    })

    mainWindow.loadURL('http://localhost:5000')
    mainWindow.on('closed', function () {
        mainWindow = null
    })

    mainWindow.maximize();
}

app.on('ready',  createWindow)

app.on('resize', function(e,x,y){
    mainWindow.setSize(x, y);
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', async function () {
    if (mainWindow === null) {
        createWindow()

    }
})
