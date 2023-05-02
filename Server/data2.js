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

      switch (command) {
            case "OPTS":
                  console.log("encoding " + dataSplit[1] + " " + dataSplit[2]);
                  socket.write('code + Server Ready!\r\n'); // pour debloquer le client
                  break;
            case "USER":
                  const username = dataSplit[1].trim();
                  commands.myCommands["USER"].callback(connectionInformation, username);
                  break;
            case "PASS":
                  const password = dataSplit[1].trim();
                  commands.myCommands["PASS"].callback(connectionInformation, password);
                  break;
            case "PWD":
            case "XPWD":
                  commands.myCommands["PWD"].callback(connectionInformation);
                  break;
            case "PORT":
                  const dataPort = dataSplit[1].trim().toString().trim();
                  commands.myCommands["PORT"].callback(connectionInformation, dataPort);
                  break;
            case "LIST":
            case "NLST":
                  const path = ""; //pour le moment
                  commands.myCommands["LIST"].callback(connectionInformation, path);
                  break;
            case "TYPE":
                  const dataType = dataSplit[1].trim().toString();
                  if (dataType == "I") {
                        socket.write('200 Type set to Binary.\r\n');
                        // socket.write('550 Only ASCII mode is supported by this server.\r\n');
                  }
                  else if (dataType == "A") {
                        socket.write('200 Type set to A.\r\n');
                  }
                  break;
            default:
                  socket.write('500 Invalid command.\r\n');
                  break;
      };
};

module.exports = {
      handleUserCommand,
};
