const net = require('net');
const commands = require('../command');

const name = 'PASV';
const helpText = 'PASV';
const description = 'To use passive mode';


function pasvFunction(connectionInformation) {
      connectionInformation.dataSocketPromise = new Promise((resolve, reject) => {
            connectionInformation.client.write("PASV");

            connectionInformation.client.once('data', (data) => {
                  //transform information received into usable data (addr, port)
                  const dataArr = data.toString().split(' ');
                  const dataAddr =  dataArr[1].replace(/[().]/g, '').split(',');
            
                  const addr = dataAddr.slice(0, 4).join('.');
                  const clientPort = parseInt(dataAddr[4]) * 256 + parseInt(dataAddr[5]);

                  //connect to the addr and port sepcified by the client
                  connectionInformation.dataSocket = net.createConnection({ port: clientPort, host: addr }, () => {
                        // console.log(`addr:port ${connectionInformation.dataSocket.remotePort}`);
                  });

                  connectionInformation.dataSocket.on('connect', () => {
                        // connectionInformation.connectionSocket.write('200 Command okay\r\n');
                        resolve();
                  });

                  connectionInformation.dataSocket.on('close', () => {
                        // reset dataSocket and promise
                        connectionInformation.dataSocketPromise = undefined;
                        connectionInformation.dataSocket = null;
                  });
            })
      })
}

commands.add(name, helpText, description, pasvFunction);
