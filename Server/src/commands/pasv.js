const commands = require('../command.js');
const net = require('net');
const os = require('os');
const name = 'PASV';
const helpText = 'PASV';
const description = 'To use passive mode';

// let localAddress = '127.0.0.1';
let localAddress = '172.18.80.134';
let localPort = 52222;

function pasvFunction(connectionInformation) {

      let localAddress = connectionInformation.connectionSocket.address().address;
      if (localAddress.includes("::ffff")) {
            let addrSplit =localAddress.split(":");
            localAddress = addrSplit[addrSplit.length - 1];
            console.log(`loc addr :${localAddress}`);
      }

      connectionInformation.dataSocketPromise = new Promise((resolve, reject) => {
            let passiveServer = net.createServer({
                  port: localPort,
                  host: localAddress
            });
            // connectionInformation.passiveServer = passiveServer;

            // // const localPort = passiveServer.address().port;
            // console.log(`passive addres : ${serverAddress}`);
            const serverAddress = localAddress.replace(/\./g, ',');
            let port1 = Math.floor(localPort / 256);
            let port2 = Math.floor(localPort % 256);

            const response = `227 (${serverAddress},${port1},${port2}).\r\n`;
            // console.log(`pasv response #${response}#`);
            connectionInformation.connectionSocket.write(response);


            passiveServer.once('connection', (dataSocket) => {
                  console.log("inside on connection");
                  connectionInformation.dataSocket = dataSocket;
                  console.log(`Data socket connected`);
                  resolve();

                  dataSocket.on('end', () => {
                        console.log(`Data socket disconnected`);
                        passiveServer.close(); //it's like the server can have juste one socket (the client for the data operation)
                  });
                  dataSocket.on('close', () => {
                        console.log("client disconnected");
                        connectionInformation.dataSocketPromise = undefined;
                        connectionInformation.dataSocket = null;
                  })

            });

            passiveServer.listen(localPort);
      })


};


commands.add(name, helpText, description, pasvFunction);