var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

//Web Server Stuff-------------------------------------

app.get('/', function(req, res){
  res.sendfile('public/index.html');
});

app.use(express.static('public'));

http.listen(3030, function(){
  console.log('listening on *:3030');
});

//Web socket stuff-------------------------------------

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
      console.log('user disconnected');
  });

  socket.on('message', function(message){
      console.log(message);
      io.emit('message', message);
  });

});
