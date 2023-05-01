const net = require('net');
// var readline = require('readline');
const { handleUserCommand } = require('./data');
require('./commands/index.js');//pour remplir toutes les commandes


const PORT = 21;
const HOST = 'localhost';
const server = net.createServer();

var connectionInformation = {
      user: null,
      connectionSocket: null,
      dataSocket: null,
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
            if (false) {
                  const dataArr = data.toString().split(" ")[1].trim().split(',');
                  const port = parseInt(dataArr[4]) * 256 + parseInt(dataArr[5]);

                  socket = net.createConnection({ port: port, host: '127.0.0.1',localAddress: '127.0.0.1',localPort: 21000 }, () => {
                        // socket.write('test data\r\n');
                        // socket.setKeepAlive(false);
                        connectionInformation.connectionSocket.write("200 PORT command successful\r\n");
                        socket.on('connect', () => {
                              console.log(`test ${socket.remoteAddress}`);
                              isConnect = true;
                              // connectionInformation.dataSocket = socket;
                        });
                        socket.on('data', (data) => {
                              console.log(`datachannel : ${data}`);
                        })
                        socket.on('close', () => {
                              console.log("le socket data est close");
                        })
                        socket.on('end', () => {
                              console.log("le socket data est close par end");
                        })
            
                        socket.on("error", (err) => {
                              console.log("Error connecting to server:", err);
                        });
            
            
                        // console.log(`type socket et dataSocket : ${typeof (socket)} ; ${typeof (connectionInformation.dataSocket)}`);
                        // console.log(`Data connection connected with ${connectionInformation.dataSocket.remoteAddress}:${socket.remotePort}`);
                        console.log(`Data connection connected with ${socket.remoteAddress}:${socket.remotePort}`);
            
                  });


            } else {
                  handleUserCommand(connectionInformation, data);
            }

      });


});

server.listen(PORT, HOST, () => console.log('Server FTP launched on port 21'));