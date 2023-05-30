const { log } = require('console');
const commands = require('../command.js');
const net = require('net');

const name = 'EPRT';
const helpText = 'EPRT <sp> <host-port>'; //a changer plus tard
const description = 'To initiate any data transference in active mode';

// let localAddress = 'localhost';
// let localAddress = '172.18.80.157';


function eprtFunction(connectionInformation, data) {
  const dataArr = data.split('|').filter(str => str.trim() !== "");;
  const addr = dataArr[1];
  const port = dataArr[2];
  console.log(`eport : ${port}`);
  connectionInformation.connectionSocket.write('200 PORT  command sucess\r\n');

  connectionInformation.dataSocket = net.createConnection({ port: port, host: addr }, () => {
    console.log('Socket de données (via PORT) créé avec succès');
  });

  connectionInformation.dataSocket.once('connect', () => {
    console.log(`test addr:port ${connectionInformation.dataSocket.remotePort}`);
    // connectionInformation.connectionSocket.write('200 PORT  command sucess\r\n');
  });

  connectionInformation.dataSocket.on('data', (data) => {
    console.log(`Received data: ${data}`);
  });

  connectionInformation.dataSocket.on('error', (err) => {
    console.log(`Error connecting to ${addr}:${port}: ${err.message}`);
  });

  connectionInformation.dataSocket.on('close', () => {
    console.log(`Data Connection closed with ${addr}:${port}`);
  });

};


// console.log(`test socket ${socket.remotePort}`);
commands.add(name, helpText, description, eprtFunction);