var net = require('net');
var readline = require('readline');

const PORT = 21;
const HOST = 'localhost';
const server = net.createServer();
export var user = "";

server.on('connection', socket => {
      console.log(`Client ${socket.remoteAddress}:${socket.remotePort} connected `);
      socket.write('Welcome new client!\n');

      socket.on('data',data => {
            console.log('data is:', data.toString() );
            socket.write(`le server a recu les donnees : ${data.toString()}\r\n`)
      });
});

server.listen(PORT, HOST, () => console.log('Server Bound'));