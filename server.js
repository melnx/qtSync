var http = require('http');
var sockjs = require('sockjs');
var express = require('express');
var _ = require('underscore');

var connections = [];

var app = express();
app.get('/', function(req,res){res.sendfile("./public/index.html");});
app.get('/qt.js', function(req,res){res.sendfile("./public/qt.js");});

var chat = sockjs.createServer();

chat.on('connection', function(conn) {
  connections.push(conn);
  var number = connections.length;
  conn.write(JSON.stringify({text:"Welcome, User " + number}));

  conn.on('data', function(message) {

    console.log(message);
    var msg = _.extend({_user: number}, JSON.parse(message));

    var sendToAll = !msg._target || !msg._target.length || msg._target == '*';

    for (var ii=0; ii < connections.length; ii++) {
      if(sendToAll || msg._user == (ii+1) || msg._target == (ii+1).toString()){
        connections[ii].write(JSON.stringify(msg));
      }
    }
  });

  conn.on('close', function() {
    for (var ii=0; ii < connections.length; ii++) {
      connections[ii].write(JSON.stringify({_user: number, text:"User " + number + " has disconnected"}));
    }
  });
});

var server = http.createServer(app);
chat.installHandlers(server, {prefix:'/chat'});
server.listen(9999,'127.0.0.1');

