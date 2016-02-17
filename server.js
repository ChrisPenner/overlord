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

var followingFiles = [];
var messages = {};

function typeOf(line){
    var good = /good/;
    var bad = /bad/;
    if(good.test(line)){
        return 'good';
    } else if (bad.test(line)) {
        return 'bad';
    }
    return 'info';
}

// Add a listener to each log-file
function addTails(){
    fs.readdir(logDir, function(err, files){
        for (var i = 0; i < files.length; i++) {
            var filename = files[i];
            addTail(filename);
        }
    });
}

// Add a listener
function addTail(filename){
    var fullpath = path.resolve(logDir, filename);
    followingFiles.push(filename);
    t = new Tail(fullpath);
    // Each time a new line comes in, send it along
    t.on("line", function(line){
        var message = {
            category: filename,
            text: line,
            type: typeOf(line)
        }
        console.log(message);
        storeMessage(message);
        io.emit("message", message)
    });
}

function storeMessage(message){
    if (messages[message.category] === undefined){
        messages[message.category] = [];
    }
    messageList = messages[message.category];
    messageList.push(message);
}


io.on('connection', function(socket){
    console.log('connected');
    socket.emit('init', messages);
    // remove socket on disconnect
    socket.on('disconnect', function () {
        console.log("disconnected");
    });

  socket.on('message', function(message){
      socket.broadcast.emit('message', message);
      console.log(message);
  });
});

// Kick-off listener
addTails();
