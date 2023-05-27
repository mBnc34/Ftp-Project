const commands = require('../command.js');
const net = require('net');

const name = 'PORT';
const helpText = 'PORT <sp> <host-port>';
const description = 'To initiate any data transference in active mode';

let localPort = 50225;

async function portFunction(connectionInformation) {

      // to extract Ipv4 if it's encapsuled in Ipv6 like ::::ff:theIPv4
      let localAddress = connectionInformation.client.address().address;
      if (localAddress.includes("::ffff")) {
            let addrSplit =localAddress.split(":");
            localAddress = addrSplit[addrSplit.length - 1];
      }

      // to prevent error of server already listening
      if (connectionInformation.portServer) {
            connectionInformation.portServer.close();
      }
      
      // create the promise of dataSocket usable in command that need dataSocket
      connectionInformation.dataSocketPromise = new Promise((resolve, reject) => {
            let passiveServer = net.createServer({
                  port: localPort,
                  host: localAddress,
            });

            // transform our addr and port into the format needed by the commant "PORT(x,x,x,x,y,y)"
            const serverAddress = localAddress.replace(/\./g, ',');
            let port1 = Math.floor(localPort / 256);
            let port2 = Math.floor(localPort % 256);
            const response = `PORT (${serverAddress},${port1},${port2})\r\n`;
   

            passiveServer.once('connection', (dataSocket) => {
                  connectionInformation.portServer = passiveServer; // to be able to delete both server and socket when we finished the transfer
                  connectionInformation.dataSocket = dataSocket;
                  resolve(); //the dataSocket is now usable for the commands that need it (for 1 transfer only)

                  dataSocket.on('end', () => {
                        passiveServer.close(); //it's like the server can have juste one socket (the client for the data operation)
                  });

                  dataSocket.on('close', () => {
                        connectionInformation.dataSocketPromise = undefined;
                        connectionInformation.dataSocket = null;
                        passiveServer.close();
                  });

                  dataSocket.on('error', () => {
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
            });
      })
}


commands.add(name, helpText, description, portFunction);