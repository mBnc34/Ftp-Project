const commands = require('../command.js');
const net = require('net');

const name = 'PORT';
const helpText = 'PORT <sp> <host-port>';
const description = 'To initiate any data transference in active mode';

// let localAddress = 'localhost';
let localAddress = '172.18.80.148';
let localPort = 58404;


function portFunction(connectionInformation, data) {
      const dataArr = data.split(',');
      const addr = dataArr.slice(0, 4).join('.');
      const clientPort = parseInt(dataArr[4]) * 256 + parseInt(dataArr[5]);
      console.log(`addr:port ${addr}:${clientPort}`);
      
      // connectionInformation.connectionSocket.write('200 PORT  command sucess\r\n');

      connectionInformation.dataSocket = net.createConnection({ port: clientPort, host: addr, localAddress: localAddress, localPort:localPort}, () => {
        console.log('Socket de données (via PORT) créé avec succès');
        // console.log(`local addr : ${connectionInformation.dataSocket.}`);
        console.log(`addr:port ${connectionInformation.dataSocket.remotePort}`);
      });

      connectionInformation.dataSocket.on('connect', () => {
        console.log(`test addr:port ${connectionInformation.dataSocket.remotePort}`);
        connectionInformation.connectionSocket.write('200 PORT command sucess\r\n');
      });

      // connectionInformation.dataSocket.on('data', (data) => {
      //   console.log(`Received data: ${data}`); //psq sinon tu vas tt recevoir
      // });
    
      connectionInformation.dataSocket.on('error', (err) => {
        console.log(`Error connecting to ${addr}:${clientPort}: ${err.message}`);
      });
    
      connectionInformation.dataSocket.on('close', () => {
        console.log(`Data Connection closed with ${addr}:${clientPort}`);
      });

    };
    

// console.log(`test socket ${socket.remotePort}`);
commands.add(name, helpText, description, portFunction);