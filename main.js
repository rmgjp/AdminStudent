/**
 * Archivo encargado de guardar las configuraciones para la creación de la ventana por Electron
 */
const {app, BrowserWindow} = require('electron');
//Declaración del Servidor mediante Express mediante la llamada del archivo app.js
//archivo cuyo codigo tiene la información necesaria para ejecutar ExpressJS
const dbcreator = require("./controllers/db");
const server = require('./app');

let mainWindow;

async function createWindow () {
    try {
        await dbcreator.initialize();
    }catch (e){
        throw e;
    }

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        autoHideMenuBar: true,
    });

    mainWindow.loadURL('http://localhost:5000/filtro/1')
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
        await createWindow()

    }
})
