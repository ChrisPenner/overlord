import ReactDOM from 'react-dom'
import React from 'react'
import App from './components/app'

let renderer = require('electron').ipcRenderer;
function init(app){
    function receiveMessage(event, filename, line){
        var categories = app.state.categories;
        var category = categories[filename];
        if (category === undefined){
            category = [];
            categories[filename] = category;
        }
        category.push(line);
        app.setState({categories: categories});
    };
    renderer.on('logs', receiveMessage);
};

let app = ReactDOM.render(<App/>, document.getElementById('app'));
init(app);
