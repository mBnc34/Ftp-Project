const net = require('net');
// var readline = require('readline');
const { handleUserCommand } = require('./data.js');
require('./commands/INDEX.js');//pour remplir toutes les commandes


const PORT = 21;
const HOST = 'localhost';
const server = net.createServer();

var connectionInformation = {
      user: null,
      connectionSocket: null,
      dataSocket: null,
      type: 'ascii',
      isConnected: false,
      rootDirectory: "C:/Users/mouss/Desktop/Ftp-Project/Server/RootDirectory",
      currentDirectory: "C:/Users/mouss/Desktop/Ftp-Project/Server/RootDirectory"
};
// le rootDirectory : le point d'entrée du client (ne peut pas aller avant ca). --> a limité selon les permissions
// currentDirectory: pour se deplacer de rootDirectory jusqu'au plus petit sous dossier max
// pour pwd, on peut penser à faire currentDirectory - rootDirectory pour commnencer a partir de rootDirectory et pas voir avant

server.on('connection', socket => {
      connectionInformation.connectionSocket = socket;

      console.log(`Client ${socket.remoteAddress}:${socket.remotePort} connected `);
      socket.write('220 Welcome from the server!\r\n');
      socket.on('data', (data) => {
            console.log(`data ${data}`);
            handleUserCommand(connectionInformation, data);
      });
      socket.on('close', ()=> {
            connectionInformation.isConnected = false;
            console.log("client disconnected");
      })
});

server.listen(PORT, HOST, () => console.log('Server FTP launched on port 21'));