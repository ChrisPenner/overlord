import {addTails, getLocations, getLogsFromFiles} from './addTails'
import electron from 'electron'
import storage from 'electron-json-storage'
import _ from 'lodash'

// Module to control application life.
const app = electron.app;
const dialog = electron.dialog;
const ipc = electron.ipcMain;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1600, height: 1000, center: true});

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/../app/html/index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  const init = (filename, lines) => mainWindow.webContents.send('init', filename, lines);
  const trackLogs = (filename, line) => mainWindow.webContents.send('logs', filename, line);
  // storage.set('userData', {})

  ipc.on('openLogLocationDialog', () => {
      dialog.showOpenDialog( {
          title: 'Choose log files or directories',
          defaultPath: '~/',
          properties: [ 'openFile', 'openDirectory', 'multiSelections' ]
      }, (locations) => {
          storage.get('userData', (err, data) => {
              console.log('log-files:', data);
              const existingLogFiles = data.logFiles || [];
              data.logFiles = _.union(existingLogFiles, locations);
              console.log('union', data.logFiles);
              storage.set('userData', data);
              const newLocations = _.difference(locations, existingLogFiles);
              console.log('newLocations', newLocations);
              initNewFiles(newLocations);
          });
      });
  });

  function initNewFiles(paths){
      getLocations(paths, (filenames) => {
          getLogsFromFiles(filenames, init);
          addTails(filenames, trackLogs);
      });
  }

  mainWindow.webContents.on('did-finish-load', function() {
      storage.get('userData', (error, data) =>{
          if (error) throw error;

          const locations = data.logFiles || [];
          initNewFiles(locations);
      });
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
