const commands = require('../command.js');
const net = require('net');

const name = 'PORT';
const helpText = 'PORT <sp> <host-port>';
const description = 'To initiate any data transference in active mode';

var socket;

function portFunction(connectionInformation, data) {
      const dataArr = data.split(',');
      const addr = dataArr.slice(0, 4).join('.');
      const port = parseInt(dataArr[4]) * 256 + parseInt(dataArr[5]);
      
      let isConnect = false;
      let socket = new net.Socket();
    
      socket.connect({ port: port, host: addr, localAddress: '127.0.0.1', localPort: 20000 });
      connectionInformation.connectionSocket.write('226 transfer finished');
      socket.on('connect', () => {
        console.log(`Connected to ${addr}:${port} from ${socket.localAddress}:${socket.localPort}`);
        connectionInformation.dataSocket = socket;
      //   socket.write('200 PORT command successful.\r\n');
        isConnect = true;
      });
    
      socket.write("200 PORT  command sucess");
      socket.on('data', (data) => {
        console.log(`Received data: ${data}`);
      });
    
      socket.on('error', (err) => {
        console.log(`Error connecting to ${addr}:${port}: ${err.message}`);
      });
    
      socket.on('close', () => {
        console.log(`Connection closed with ${addr}:${port}`);
      });
    
      setTimeout(() => {
        if (!isConnect) {
          console.log(`Timeout connecting to ${addr}:${port}`);
          socket.destroy();
        }
      }, 10000);
    }
    

// console.log(`test socket ${socket.remotePort}`);
commands.add(name, helpText, description, portFunction);