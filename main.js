import electron from 'electron';

import path from 'path';
import fs   from 'fs';

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

(async () => {
    let mainWindow = null;
    let localSave = path.resolve(`${app.getPath('appData')}/cemu-smmdb`);
    let savePath = path.join(`${localSave}/save.txt`);
    let saveData;
    if (!!localSave) {
        if (fs.existsSync(savePath)) {
            try {
                saveData = JSON.parse(fs.readFileSync(savePath));
                /*saveData = await new Promise((resolve, reject) => {
                    fs.readFile(savePath, (err, data) => {
                        resolve();
                        if (err) {
                            reject(err);
                        }
                        try {
                            resolve(JSON.parse(data));
                        } catch (err) {
                            resolve();
                        }
                    });
                });*/
            } catch (err) {
                // ignore ?
            }
        } else {
            fs.writeFile(savePath, "");
        }
    }
    global.save = {
        saveData: saveData,
        savePath: savePath
    };

    function createWindow () {
        mainWindow = new BrowserWindow({width: 1200, height: 900});

        mainWindow.loadURL('file://' + __dirname + '/gui/index.html');

        if (process.env.NODE_ENV === 'development') {
            mainWindow.webContents.openDevTools();
        }

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

})();
