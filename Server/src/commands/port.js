const commands = require('../command.js');
const net = require('net');

const name = 'PORT';
const helpText = 'PORT <sp> <host-port>';
const description = 'To initiate any data transference in active mode';


function portFunction(connectionInformation, data) {
      const dataArr = data.split(',');
      const addr = dataArr.slice(0, 4).join('.');
      const port = parseInt(dataArr[4]) * 256 + parseInt(dataArr[5]);
      
      connectionInformation.dataSocket = net.createConnection({ port: port, host: addr, localAddress: '127.0.0.1', localPort: 20000  }, () => {
        console.log('Socket de données créé avec succès');
        // console.log(`addr:port ${connectionInformation.dataSocket.remotePort}`);
      });

      connectionInformation.dataSocket.once('connect', () => {
        // console.log(`test addr:port ${connectionInformation.dataSocket.remotePort}`);
        connectionInformation.connectionSocket.write('200 PORT  command sucess\r\n');
      });

      connectionInformation.dataSocket.on('data', (data) => {
        console.log(`Received data: ${data}`);
      });
    
      connectionInformation.dataSocket.on('error', (err) => {
        console.log(`Error connecting to ${addr}:${port}: ${err.message}`);
      });
    
      connectionInformation.dataSocket.on('close', () => {
        console.log(`Connection closed with ${addr}:${port}`);
      });

    };
    

// console.log(`test socket ${socket.remotePort}`);
commands.add(name, helpText, description, portFunction);