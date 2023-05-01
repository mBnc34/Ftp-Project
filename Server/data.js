// const { server } = require('./server');
const fs = require('fs');
const net = require('net');

const commands = require('./command');
require('./commands/index.js'); // apres enlever et creer des index.js dans chaque rep pour import les fichiers necessaire
console.log(commands.myCommands);
// console.log(users);

// ls : nlst
// get : RETR
// close : QUIT


function handleUserCommand(connectionInformation, data) {

  const socket = connectionInformation.connectionSocket;
  const user = connectionInformation.user;

  const dataSplit = data.toString().split(" ");
  const command = dataSplit[0].trim();
  console.log("command : " + command);
  //apres au lieu de if / else if etc
  // soit faire un case soit utilliser un objet

  if (command === "OPTS") {
    console.log("encoding " + dataSplit[1] + " " + dataSplit[2]);
    socket.write('code + Server Ready!\r\n'); // pour debloquer le client
  }
  else if (command === 'USER') {
    const username = dataSplit[1].trim();
    commands.myCommands["USER"].callback(connectionInformation, username);

  } 
  else if (command === 'PASS') {
    const password = dataSplit[1].trim();
    commands.myCommands["PASS"].callback(connectionInformation, password);

  } 
  else if (command === 'PWD' || command === 'XPWD') {
    commands.myCommands["PWD"].callback(connectionInformation);

  }
  else if (command === 'TYPE') {
    const data = dataSplit[1].trim().toString();
    if (data =="I"){
      socket.write('200 Type set to Binary.\r\n');
      // socket.write('550 Only ASCII mode is supported by this server.\r\n');
    }
    else if(data == "A"){
      socket.write('200 Type set to A.\r\n');
    }
  }
  // else if (command === 'LIST') {
  //   const path = "";
  //   commands.myCommands["LIST"].callback(connectionInformation, path);

  // } 
  else if (command === 'PORT' || command === 'LIST'|| command === 'NLST' ) {

    if (command === 'PORT'){
      let datas = dataSplit[1].toString().trim().split(',');
      const addr = datas.slice(0, 4).join('.');
      const port = parseInt(datas[4]) * 256 + parseInt(datas[5]);

      connectionInformation.dataSocket = net.createConnection({ port: port, host: addr, localAddress: '127.0.0.1', localPort: 20000  }, () => {
        console.log('Socket de données créé avec succès');
        console.log(`addr:port ${connectionInformation.dataSocket.remotePort}`);
      });
      connectionInformation.dataSocket.once('connect', () => {
        console.log(`test addr:port ${connectionInformation.dataSocket.remotePort}`);
        connectionInformation.connectionSocket.write('200 PORT  command sucess\r\n');
      });
    }
    if (command === 'LIST' || command === 'NLST'){
      console.log(`test addr:port ${connectionInformation.dataSocket.remotePort}`);
      const path = "";
      commands.myCommands["LIST"].callback(connectionInformation, path);
    }





    // const data = dataSplit[1].toString().trim();
    // commands.myCommands["PORT"].callback(connectionInformation, data);
    // console.log(`Data connection connected with ${connectionInformation.dataSocket.remoteAddress}`);
    // en gros ce log est appelé avant que le callback soit fini...
    // connectionInformation.connectionSocket.write('100 test data\r\n');
    // connectionInformation.dataSocket.write('101 data  test 2');
  } else {
    socket.write('500 Invalid command.\r\n');
  }

}

module.exports = {
  handleUserCommand,
};
