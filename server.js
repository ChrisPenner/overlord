#!/usr/bin/env node
var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var fs = require('fs');
var path = require('path')
var Tail = require('tail').Tail;

var serverDir = path.dirname(process.argv[1]);
var executionDir = process.cwd();
var logDir = process.argv[2] || executionDir;

if(!path.isAbsolute(logDir)){
    logDir = path.join(executionDir, logDir);
}

console.log(logDir);

//Web Server Stuff-------------------------------------

app.get('/', function(req, res){
  res.sendFile(path.join(serverDir, './public/index.html'));
});

app.use(express.static(serverDir + '/public'));

http.listen(3030, function(){
  console.log('listening on *:3030');
});

//Web socket stuff-------------------------------------

function addTail(filename, socket){
    var fullpath = path.resolve(logDir, filename);
    t = new Tail(fullpath);
    t.on("line", function(line){
        var message = {
            server: filename,
            line: line
        }
        console.log(message);
        socket.emit("message", message);
    });
}

io.on('connection', function(socket){
    fs.readdir(logDir, function(err, files){
        for (var i = 0; i < files.length; i++) {
            var filename = files[i];
            addTail(filename, socket);
        }
    });
});

