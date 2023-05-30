const fs = require('fs');

const commands = require('./command');
require('./commands/INDEX.js'); // apres enlever et creer des index.js dans chaque rep pour import les fichiers necessaire
// console.log(commands.myCommands);


function handleUserCommand(connectionInformation, data) {

      const socket = connectionInformation.connectionSocket;
      // const user = connectionInformation.user;
      const dataSplit = data.toString().split(/\s+/); //  no matter how many space for the split
      const command = dataSplit[0].trim();


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
                  let pwdPath = dataSplit.length === 1 ? "" : dataSplit[1].trim().toString();
                  commands.myCommands["PWD"].callback(connectionInformation, pwdPath);
                  break;
            case "PORT":
                  const dataPort = dataSplit[1].trim().toString().trim();
                  commands.myCommands["PORT"].callback(connectionInformation, dataPort);
                  break;
            case "EPRT":
                  const dataEprt = dataSplit[1].trim().toString().trim();
                  commands.myCommands["EPRT"].callback(connectionInformation, dataEprt);
                  break;
            case "PASV":
                  commands.myCommands["PASV"].callback(connectionInformation);
                  break;
            case "LIST":
            case "NLST":
                  const path = ""; //pour le moment
                  connectionInformation.dataSocketPromise.then(() => {
                        // console.log("inside list promise");
                        commands.myCommands["LIST"].callback(connectionInformation, path);
                  })

                  break;
            case "RETR":
                  let retrPath = dataSplit.length === 1 ? "" : dataSplit[1].trim().toString();
                  connectionInformation.dataSocketPromise.then(() => {
                        commands.myCommands["RETR"].callback(connectionInformation, retrPath);
                  })
                  break;
            case "STOR":
                  let storPath = dataSplit.length === 1 ? "" : dataSplit[1].trim().toString();
                  connectionInformation.dataSocketPromise.then(() => {
                        commands.myCommands["STOR"].callback(connectionInformation, storPath);
                  })
                  break;
            case "CWD":
                  let cwdPath = dataSplit.length === 1 ? "" : dataSplit[1].trim().toString();
                  commands.myCommands["CWD"].callback(connectionInformation, cwdPath);
                  break;
            case "MKD":
                  let mkdPath = dataSplit.length === 1 ? "" : dataSplit[1].trim().toString();
                  commands.myCommands["MKD"].callback(connectionInformation, mkdPath);
                  break;
            case "RMD":
                  let rmdPath = dataSplit.length === 1 ? "" : dataSplit[1].trim().toString();
                  commands.myCommands["RMD"].callback(connectionInformation, rmdPath);
                  break;
            case "DELE":
                  let delePath = dataSplit.length === 1 ? "" : dataSplit[1].trim().toString();
                  commands.myCommands["DELE"].callback(connectionInformation, delePath);
                  break;
            case "RNFR":
                  let rnfrPath = dataSplit.length === 1 ? "" : dataSplit[1].trim().toString();
                  commands.myCommands["RNFR"].callback(connectionInformation, rnfrPath);
                  break;
            case "RNTO":
                  let newName = dataSplit.length === 1 ? "" : dataSplit[1].trim().toString();
                  commands.myCommands["RNTO"].callback(connectionInformation, newName);
                  break;
            case "TYPE":
                  const dataType = dataSplit[1].trim().toString();
                  if (dataType == "I") {
                        connectionInformation.type = "I";
                        socket.write('200 Type set to Binary.\r\n');
                        // socket.write('550 Only ASCII mode is supported by this server.\r\n');
                  }
                  else if (dataType == "A") {
                        connectionInformation.type = "A";
                        socket.write('200 Type set to A.\r\n');
                  }
                  break;
            case "QUIT":
                  commands.myCommands["QUIT"].callback(connectionInformation);
                  break;
            default:
                  socket.write('500 Invalid command.\r\n');
                  break;
      };
};

module.exports = {
      handleUserCommand,
};
