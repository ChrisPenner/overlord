#!/usr/bin/env node
var stdin = process.stdin
var stdout = process.stdout

var io = require('socket.io-client')
var socket = io.connect('http://localhost:3030', {reconnect: true});

var name = process.argv[2];

stdin.resume();
stdin.setEncoding('utf8');

stdin.on('data', function (input) {
    console.log(input);
    var message = {
        server: name,
        line: input
    }
    socket.emit('message', message);
});
