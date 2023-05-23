const commands = require('../command.js');
const net = require('net');

const name = 'PORT';
const helpText = 'PORT <sp> <host-port>';
const description = 'To initiate any data transference in active mode';

let localAddress = '127.0.0.1';
// let localAddress = '172.18.80.164';
let localPort = 50225;


async function portFunction(connectionInformation) {

      if (connectionInformation.portServer) {
            connectionInformation.portServer.close();
      }

      connectionInformation.dataSocketPromise = new Promise((resolve, reject) => {
            let passiveServer = net.createServer({
                  port: localPort,
                  host: localAddress
            });

            const serverAddress = localAddress.replace(/\./g, ',');
            let port1 = Math.floor(localPort / 256);
            let port2 = Math.floor(localPort % 256);
            const response = `PORT (${serverAddress},${port1},${port2})\r\n`;
            // console.log(`pasv response #${response}#`);

            passiveServer.once('connection', (dataSocket) => {
                  connectionInformation.portServer = passiveServer;
                  // console.log("inside on connection");
                  connectionInformation.dataSocket = dataSocket;
                  // console.log(`Data socket connected`);
                  resolve();

                  dataSocket.on('end', () => {
                        console.log(`Data socket disconnected`);
                        passiveServer.close(); //it's like the server can have juste one socket (the client for the data operation)
                        passiveServer.close();
                  });
                  dataSocket.on('close', () => {
                        console.log("client disconnected");
                        connectionInformation.dataSocketPromise = undefined;
                        connectionInformation.dataSocket = null;
                        passiveServer.close();
                  });
                  dataSocket.on('error', () => {
                        console.log("client disconnected");
                        passiveServer.close();
                        connectionInformation.dataSocketPromise = undefined;
                        connectionInformation.dataSocket = null;
                  });

            });

            passiveServer.listen(localPort, () => {
                  try {
                        connectionInformation.client.write(response);
                  } catch (error) {
                        console.log(error);
                  }

                  // console.log(`passive server listening on port ${localPort}`);
            });

      })
}


commands.add(name, helpText, description, portFunction);