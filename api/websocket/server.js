const ws = require('socket.io');

//we provide basic websocket relay capability
module.exports = function(httpServer){
  let io = ws(httpServer);
  io.on('connection', function(socket){
    socket.join('changes'); //automatically put everyone in the changes room
  });
};
