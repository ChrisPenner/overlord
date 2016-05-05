import {addTail, getFileNames, getLogsFromFile} from './addTails'
import electron from 'electron'
import storage from 'electron-json-storage'
import _ from 'lodash'
import addLifeCycleHooks from './life-cycle'

// Module to control application life.
const app = electron.app;
addLifeCycleHooks(app);

const dialog = electron.dialog;
const ipc = electron.ipcMain;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

let userData = {logDir: null};
// storage.set('userData', userData);


function createWindow () {
  mainWindow = new BrowserWindow({width: 1600, height: 1000, center: true});
  mainWindow.loadURL('file://' + __dirname + '/../app/html/index.html');
  mainWindow.webContents.on('did-finish-load', () => { 
      ipc.emit('newWindow', mainWindow); 
  });

  mainWindow.on('closed', () => {
      mainWindow = null;
  });
}

app.on('ready', createWindow);

ipc.on('openLogLocationDialog', () => {
    dialog.showOpenDialog( {
        title: 'Choose log files or directories',
        defaultPath: '~/',
        properties: [ 'openDirectory' ]
    }, (logDirs) => {
        if (!logDirs || logDirs.length == 0){
            return
        }
        const logDir = logDirs[0]
        console.log('received:', logDir)
        const previousLocation = userData.logDir
        userData.logDir = logDir
        storage.set('userData', userData);
        if (logDir != previousLocation){
            ipc.emit('newLogDir', logDir);
        }
    });
});

ipc.on('newWindow', (window) => {
    const logDir = userData.logDir;
    if (!logDir) {
        return
    }
    getFileNames(logDir, (filename) => {
        getLogsFromFile(filename, (filename, lines) => {
            window.webContents.send('init', filename, lines)
        });
    });
});

ipc.on('newLogDir', (paths) => {
    getFileNames(paths, (filename) => {
        getLogsFromFile(filename, (filename, lines) => {
            if (mainWindow) {
                mainWindow.webContents.send('init', filename, lines);
            }
        });
        addTail(filename, (filename, line) => {
            if (mainWindow) {
                mainWindow.webContents.send('logs', filename, line)
            }
        });
    });
});
storage.get('userData', (error, data) => {
    if (error) throw error;
    if (userData.logDir) {
        ipc.emit('newLogDir', userData.logDir);
    }
});
