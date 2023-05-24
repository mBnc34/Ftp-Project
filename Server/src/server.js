const net = require('net');
// var readline = require('readline');
const os = require('os');
const { handleUserCommand } = require('./data.js');
// require('./commands/INDEX.js');//pour remplir toutes les commandes

const PORT = 21000;
// const HOST = 'localhost'; // a enlever pour ecouter sur d'autres reseau
const networkInterfaces = os.networkInterfaces();
const addresses = [];

for (const interfaceName in networkInterfaces) {
      const interfaces = networkInterfaces[interfaceName];

      for (const iface of interfaces) {
            // Filtrer les adresses IPv4 non-localhost avec le masque 255.255.224.0
            if (iface.family === 'IPv4' && !iface.internal && iface.netmask === '255.255.224.0') {
                  addresses.push(iface.address);
            }
      }
}
// const HOST = '172.18.80.134';
const HOST = addresses[0];
const server = net.createServer();

// le rootDirectory : le point d'entrée du client (ne peut pas aller avant ca). --> a limité selon les permissions
// currentDirectory: pour se deplacer de rootDirectory jusqu'au plus petit sous dossier max
// pour pwd, on peut penser à faire currentDirectory - rootDirectory pour commnencer a partir de rootDirectory et pas voir avant
function startServer() {
      server.on('connection', socket => {
            var connectionInformation = {
                  user: null,
                  connectionSocket: null,
                  passiveServer: null,
                  dataSocket: null,
                  dataSocketPromise: null,
                  type: 'A',
                  isConnected: false,
                  rootDirectory: "Server/RootDirectory",
                  currentDirectory: "Server/RootDirectory",
                  rnfrPath: ""
            };
            connectionInformation.connectionSocket = socket;
      
            console.log(`Client ${socket.remoteAddress}:${socket.remotePort} connected `);
            socket.write('220 Welcome from the server!\r\n');
            socket.on('data', (data) => {
                  console.log(`data ${data}`);
                  handleUserCommand(connectionInformation, data);
            });
      
            socket.on('error', (error) => {
                  if (error.code === 'ECONNRESET') {
                        connectionInformation.isConnected = false;
                        // console.log("Client disconnected");
                  } else {
                        console.error("An error occurred with the client connection:", error);
                  }
            });
      
      
            socket.on('close', () => {
                  try {
                        connectionInformation.isConnected = false;
                        console.log("client disconnected");
                  } catch (error) {
                        console.error("An error occurred while handling client disconnection:", error);
                  }
            })
      });
      
      server.listen(PORT, HOST, () => console.log(`Server FTP launched on port ${PORT}`));
            // server.listen(PORT,  () => console.log('Server FTP launched on port 21'));
}

startServer();