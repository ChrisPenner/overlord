import ReactDOM from 'react-dom';
import React from 'react';
import electron from 'electron';
import App from './components/app';
let renderer = electron.ipcRenderer;

function init(app){
    renderer.on('logs', (e, filename, line) => app.addMessage(filename, line));
};

let app = ReactDOM.render(<App/>, document.getElementById('app'));
init(app);
