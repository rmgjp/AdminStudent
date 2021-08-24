/**
 * Archivo encargado de guardar las configuraciones para la creación de la ventana por Electron
 */
const path = require('path');
const {app, BrowserWindow} = require('electron');
//Declaración del Servidor mediante Express mediante la llamada del archivo app.js
//archivo cuyo codigo tiene la información necesaria para ejecutar ExpressJS
const server = require('./app');
const {exec} = require('child_process');
var executablePath = path.join(__dirname , 'mariadb\\bin\\mysqld.exe --console');
var parameters = ["--console"];
const firstRun = require('electron-first-run');
const datadb = require('./config/config.json')



let mainWindow;

function createWindow () {
    if(process.platform === 'win32'){
        //gyNr%s@&#SN#
        if(firstRun()){

            exec(path.join(__dirname, `mariadb\\bin\\mysql_install_db.exe --datadir=${path.join(__dirname, `mariadb\\data`)} --password=${datadb.registrobd.password} --port=${datadb.registrobd.port}`))
        }


       exec(executablePath, (err, stdout,stderr)=> {
            if(err){
                console.error("Hubo un error: " + err);
                return;
            }
           console.log(`stdout: ${stdout}`);
           console.error(`stderr: ${stderr}`);
        });
    }


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
