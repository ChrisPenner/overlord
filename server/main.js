import {addTails, getFileNames, getLogsFromFiles} from './addTails'
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

let userData = {logFiles: []};

function createWindow () {
  mainWindow = new BrowserWindow({width: 1600, height: 1000, center: true});
  mainWindow.loadURL('file://' + __dirname + '/../app/html/index.html');
  mainWindow.webContents.openDevTools();
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
        properties: [ 'openFile', 'openDirectory', 'multiSelections' ]
    }, (locations) => {
        const existingLogFiles = userData.logFiles || [];
        userData.logFiles = _.union(existingLogFiles, locations);
        storage.set('userData', userData);
        const newLocations = _.difference(locations, existingLogFiles);
        ipc.emit('newLocations', newLocations);
    });
});

ipc.on('newWindow', (window) => {
    const paths = userData.logFiles;
    getFileNames(paths, (filenames) => {
        getLogsFromFiles(filenames, (filename, lines) => {
            window.webContents.send('init', filename, lines)
        });
    });
});

ipc.on('newLocations', (paths) => {
    getFileNames(paths, (filenames) => {
        getLogsFromFiles(filenames, (filename, lines) => {
            if (mainWindow) {
                mainWindow.webContents.send('init', filename, lines);
            }
        });
        addTails(filenames, (filename, line) => {
            if (mainWindow) {
                mainWindow.webContents.send('logs', filename, line)
            }
        });
    });
});

storage.get('userData', (error, data) => {
    if (error) throw error;
    userData = _.defaults(data, {logFiles: []});
    ipc.emit('newLocations', userData.logFiles);
});
