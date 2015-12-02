#!/usr/bin/env node
var io = require('socket.io-client')
var socket = io.connect('http://localhost:3030', {reconnect: true});
var fs = require('fs');
var path = require('path')
var dir = process.cwd();

var Tail = require('tail').Tail;

function addTail(filename){
    var fullpath = path.resolve(dir, filename);
    t = new Tail(fullpath);
    t.on("line", function(line){
        socket.emit("message", {
            server: filename,
            line: line
        });
    });
}

fs.readdir(dir, function(err, files){
    for (var i = 0; i < files.length; i++) {
        var filename = files[i];
        addTail(filename);
    }
});
