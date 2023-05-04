const commands = require('../command.js');
const net = require('net');

const name = 'PASV';
const helpText = 'PASV';
const description = 'To use passive mode';

let localAddress = '127.0.0.1';
// let localAddress = '172.18.80.129';
// let localPort = 20000;
let socketTest;

function pasvFunction(connectionInformation) {
      console.log("pasvTest");
      var passiveServer;
      passiveServer = net.createServer({
            port: 20000,
            host: localAddress
      });
      
      // const localPort = passiveServer.address().port;
      const localPort = 20000;
      const serverAddress = localAddress.replace(/\./g, ',');
      let port1 = Math.floor(localPort / 256);
      let port2 = Math.floor(localPort % 256);

      // Construction de la réponse à envoyer au client
      const response = `227 Entering Passive Mode (${serverAddress},${port1},${port2}).\r\n`;
      console.log(`pasv response #${response}#`);
      connectionInformation.connectionSocket.write(response);
      passiveServer.on('listening', (socket) => {
            console.log("listening");
      } )


      passiveServer.once('connection', (dataSocket) => {
            console.log("inside on connection");
            connectionInformation.dataSocket = dataSocket;
            socketTest = dataSocket;
            console.log(`socketTest : ${socketTest.remoteAddress}:${socketTest.remotePort}`);
            console.log(`Data socket connected`);
            // Fermeture automatique du serveur de données lorsque le transfert est terminé
            dataSocket.on('end', () => {
                  console.log(`Data socket disconnected`);
                  passiveServer.close();
            });
            dataSocket.on('close', () => {
                  console.log("client disconnected");
            })
            // connectionInformation.dataSocket = socketTest;
      });

      passiveServer.listen();

};


commands.add(name, helpText, description, pasvFunction);