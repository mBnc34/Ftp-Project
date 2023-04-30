const commands = require('../command.js');
const net = require('net');

const name = 'PORT';
const helpText = 'PORT <sp> <host-port>';
const description = 'To initiate any data transference in active mode';

var socket;

function portFunction(connectionInformation, data) {
      const dataArr = data.split(',');
      const addr = dataArr.slice(0, 4).join('.');
      console.log('remote addr for PORT : ' + addr);

      const port = parseInt(dataArr[4]) * 256 + parseInt(dataArr[5]);

      let isConnect = false;

      socket = net.createConnection({ port: port, host: addr }, () => {
            connectionInformation.connectionSocket.write("200 PORT command successful\r\n");
                  socket.once('connect', () => {
                        console.log(`test ${socket.remoteAddress}`);
                        isConnect = true;
                        // connectionInformation.dataSocket = socket;
                  });

      

            socket.on("error", (err) => {
                  console.log("Error connecting to server:", err);
            });


            console.log(`type socket et dataSocket : ${typeof (socket)} ; ${typeof (connectionInformation.dataSocket)}`);
            // console.log(`Data connection connected with ${connectionInformation.dataSocket.remoteAddress}:${socket.remotePort}`);
            console.log(`Data connection connected with ${socket.remoteAddress}:${socket.remotePort}`);

      });

      //creer une fonction exterieur qui permet de fermé cette connexion en utilisant la var de fichier ou de connectionInformation
};


commands.add(name, helpText, description, portFunction);