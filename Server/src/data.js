// const { server } = require('./server');
const fs = require('fs');
// const net = require('net');

const commands = require('./command');
require('./commands/index.js'); // apres enlever et creer des index.js dans chaque rep pour import les fichiers necessaire
console.log(commands.myCommands);

// get : RETR
// close : QUIT


function handleUserCommand(connectionInformation, data) {

  const socket = connectionInformation.connectionSocket;
  const user = connectionInformation.user;

  const dataSplit = data.toString().split(" ");
  const command = dataSplit[0].trim();
  // console.log("command : " + command);
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
  // PROBLEME PWD -> APRES CWD mon currentDir a beaucoup trop de "/" au debut
  else if (command === 'PWD' || command === 'XPWD') {
    commands.myCommands["PWD"].callback(connectionInformation);
  }
  else if (command === 'TYPE') {
    const data = dataSplit[1].trim().toString();
    if (data == "I") {
      socket.write('200 Type set to Binary.\r\n');
      // socket.write('550 Only ASCII mode is supported by this server.\r\n');
    }
    else if (data == "A") {
      socket.write('200 Type set to A.\r\n');
    }
  }
  else if (command === 'LIST' || command === 'NLST') {
    const path = ""; //pour le moment
    commands.myCommands["LIST"].callback(connectionInformation, path);
  }
  else if (command === 'CWD' ) {
    let path = dataSplit.length === 1 ? "" : dataSplit[1].trim().toString();
    commands.myCommands["CWD"].callback(connectionInformation, path);
  }
  else if (command === "PORT") {
    const data =  dataSplit[1].trim().toString().trim();
    commands.myCommands["PORT"].callback(connectionInformation,data);
  }
  else {
    socket.write('500 Invalid command.\r\n');
  }

}

module.exports = {
  handleUserCommand,
};
