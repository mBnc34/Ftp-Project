const commands = require('../command.js');
const fs = require('fs');

const usersFile = 'Server/src/Users/users.json';
const rawData = fs.readFileSync(usersFile);
const users = JSON.parse(rawData);

const name = 'USER';
const helpText = 'USER <sp> <username>';
const description = 'To authenticate';


function userFunction(connectionInformation, username) {
      if (connectionInformation.connectionSocket != null) {
            // console.log(message);
            // if (connectionInformation.isConnected) {
            //       // message d'erreur : already connected
            //       // connectionSocket.write('already connected');
            //       console.log("deja connecté");
            //       connectionInformation.connectionSocket.write("error deja connecté\r\n"); //important pour debloquer le terminal du client
            //       return;
            // };
            // else

            // verifie que le user existe: 
            if (!existUser(username)) {
                  console.log("no user with name : " + username);
                  connectionInformation.connectionSocket.write(`500 no user with name : ${username}\r\n`)
                  return;
            }

            // else
            connectionInformation.user = username; 
            // --> we need to connect after password --> to be change
            connectionInformation.connectionSocket.write('331 User name okay, need password.\r\n');
            return;
      }
      console.log("no socket for connection");
}

function existUser(username) {
      // return Object.keys(users).includes(username);
      return users.hasOwnProperty(username);
}

commands.add(name, helpText, description, userFunction);