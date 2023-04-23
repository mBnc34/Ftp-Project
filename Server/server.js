var net = require('net');
var readline = require('readline');

const server = net.createServer();

server.on('connection', socket => {
      console.log(`Client ${socket.remoteAddress}:${socket.remotePort} connectedd `);
      socket.write('Welcome new client!\n');

      socket.on('data',data => {
            console.log('data is:', data );
      });
});

server.listen(8000, () => console.log('Server Bound'));