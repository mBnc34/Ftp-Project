const net = require('net');
// var readline = require('readline');
const {handleUserCommand} = require('./data');


const PORT = 21;
const HOST = 'localhost';
const server = net.createServer();
var user = "";

var connectionSocket;
var connectionInformation = {
      user: user,
      socket: connectionSocket
}



server.on('connection', socket => {
      connectionSocket = socket;
      console.log(typeof(connectionSocket));
      console.log(typeof(socket));
      console.log(typeof(net.Socket)); // les 2 premiers sont OBJECT et la c'est fonction
      console.log(`Client ${socket.remoteAddress}:${socket.remotePort} connected `);
      socket.write('220 Welcome from the server!\r\n');
      socket.on('data', (data) => {
            handleUserCommand(socket, data);
      });

      
});

server.listen(PORT, HOST, () => console.log('Server FTP launched on port 21'));