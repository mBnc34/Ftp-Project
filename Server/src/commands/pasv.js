const commands = require('../command.js');
const net = require('net');

const name = 'PASV';
const helpText = 'PASV';
const description = 'To use passive mode';

let localAddress = '127.0.0.1';
// let localAddress = '172.18.80.129';
let localPort = 52222;
let socketTest;

 function pasvFunction(connectionInformation) {
      console.log("pasvTest");

      // connectionInformation.passiveServer = net.createServer({
      //       // port: localPort,
      //       // host: localAddress
      // });
     
      let passiveServer = net.createServer({
            port: localPort,
            host: localAddress
      });

      // // const localPort = passiveServer.address().port;

      const serverAddress = localAddress.replace(/\./g, ',');
      let port1 = Math.floor(localPort / 256);
      let port2 = Math.floor(localPort % 256);

      // Construction de la réponse à envoyer au client
      // const response = `227 Entering Passive Mode\r\n`;
      const response = `227 (${serverAddress},${port1},${port2}).\r\n`;
      // const response = `PORT (${serverAddress},${port1},${port2}).\r\n`;
      console.log(`pasv response #${response}#`);
      connectionInformation.connectionSocket.write(response);


      passiveServer.once('connection', (dataSocket) => {
            console.log("inside on connection");
            connectionInformation.dataSocket = dataSocket;
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

      passiveServer.listen(localPort);

};


commands.add(name, helpText, description, pasvFunction);