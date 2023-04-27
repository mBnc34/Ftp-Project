var net = require('net');
var readline = require('readline');
const { userFunction } = require('./commands/user')

const PORT = 21;
const HOST = 'localhost';
const server = net.createServer();
var user = "";
var connectionSocket;

module.exports = {
      user,
      // connectionSocket,
      server
};



server.on('connection', socket => {
      console.log(`Client ${socket.remoteAddress}:${socket.remotePort} connected `);
      socket.write('Welcome new client!\n');
      connectionSocket = socket;
      socket.on('data', data => {
            console.log('data is:', data.toString());
            socket.write(`le server a recu les donnees : ${data.toString()}\r\n`)
            if (data.toString().includes("USER")) {
                  const [command, name] = data.toString().split(' ');
                  console.log("user bien reco");
                  console.log(name);
                  // socket.write(`ecrivez le nom d'utilisateur\r\n`);
                  // socket.once('data', data => {
                  //       console.log(data);
                  //       userFunction(data);
                  // })
                  userFunction(socket, name);
            }
      });
});

server.listen(PORT, HOST, () => console.log('Server Bound'));