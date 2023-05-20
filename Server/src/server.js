      const net = require('net');
      // var readline = require('readline');
      const { handleUserCommand } = require('./data.js');
      // require('./commands/INDEX.js');//pour remplir toutes les commandes

      const PORT = 21;
      const HOST = 'localhost'; // a enlever pour ecouter sur d'autres reseau
      // const HOST = '172.18.80.164';
      const server = net.createServer();

      // le rootDirectory : le point d'entrée du client (ne peut pas aller avant ca). --> a limité selon les permissions
      // currentDirectory: pour se deplacer de rootDirectory jusqu'au plus petit sous dossier max
      // pour pwd, on peut penser à faire currentDirectory - rootDirectory pour commnencer a partir de rootDirectory et pas voir avant

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
            socket.on('close', ()=> {
                  connectionInformation.isConnected = false;
                  console.log("client disconnected");
            })
      });

      server.listen(PORT, HOST, () => console.log('Server FTP launched on port 21'));
      // server.listen(PORT,  () => console.log('Server FTP launched on port 21'));