const ws = require('socket.io');

//we provide basic (dumb) websocket relay capability
module.exports = function(httpServer){
  let io = ws(httpServer); //wrap our underlying http server
  io.on('connection', function(socket){
    socket.join('changes'); //automatically put everyone in the changes room
    socket.on('relationships_added', function(data){
      socket.broadcast.emit('relationships_added', data);
    });
    socket.on('relationships_removed', function(data){
      socket.broadcast.emit('relationships_removed', data);
    });
  });
};
