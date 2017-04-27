const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
//const crashReporter = electron.crashReporter
//const shell = electron.shell

const path = require('path');
const url  = require('url');
const fs   = require('fs');

let mainWindow = null;
let webContents = electron.webContents;
console.log(webContents);

//crashReporter.start()

function createWindow () {
    mainWindow = new BrowserWindow({width: 1200, height: 900});

    mainWindow.loadURL('file://' + __dirname + '/gui/index.html');

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit()
});

app.on('activate', () => {
    createWindow()
});

app.on('uncaughtException', (err) => {
    fs.writeFileSync('./error_log.txt', err)
});