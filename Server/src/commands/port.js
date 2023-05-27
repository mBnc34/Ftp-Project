const commands = require('../command.js');
const net = require('net');

const name = 'PORT';
const helpText = 'PORT <sp> <host-port>';
const description = 'To initiate any data transference in active mode';

let localAddress = 'localhost';
// let localAddress = '172.18.80.148';
let localPort = 58404;


function portFunction(connectionInformation, data) {
  connectionInformation.dataSocketPromise = new Promise((resolve, reject) => {
    const dataArr = data.replace(/[().]/g, '').split(',');
    const addr = dataArr.slice(0, 4).join('.');
    const clientPort = parseInt(dataArr[4]) * 256 + parseInt(dataArr[5]);
    console.log(`addr:port ${addr}:${clientPort}`);


    connectionInformation.dataSocket = net.createConnection({ port: clientPort, host: addr }, () => {
      console.log('Socket de données (via PORT) créé avec succès');
      console.log(`addr:port ${connectionInformation.dataSocket.remotePort}`);
    });

    connectionInformation.dataSocket.on('connect', () => {
      console.log(`test addr:port ${connectionInformation.dataSocket.remotePort}`);
      connectionInformation.connectionSocket.write('200 Command okay\r\n');
      resolve();
    });

    connectionInformation.dataSocket.on('error', (err) => {
      if (error.code === 'ECONNRESET') {
        connectionInformation.isConnected = false;
        connectionInformation.dataSocket.end();
        // console.log("Client disconnected");
      } else {
        console.log(`Error connecting to ${addr}:${clientPort}: ${err.message}`);
      }
    });

    connectionInformation.dataSocket.on('close', () => {
      console.log(`Data Connection closed with ${addr}:${clientPort}`);
      connectionInformation.dataSocketPromise = undefined;
      connectionInformation.dataSocket = null;
    });

  })

};


commands.add(name, helpText, description, portFunction);