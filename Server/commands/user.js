const commands = require('../command.js');
const fs = require('fs');
// const usersFile = require('../Users/users.json');
const usersFile = 'C:/Users/mouss/Desktop/Ftp-Project/Server/Users/users.json';
const rawData = fs.readFileSync(usersFile);
const users = JSON.parse(rawData);

const name = 'USER';
const helpText = 'USER <sp> <username>';
const description = 'To authenticate';

function userFunction(connectionInformation, username) {
      if (connectionInformation.connectionSocket != null) {
            // console.log(message);
            if (connectionInformation.isConnected) {
                  // message d'erreur : already connected
                  // connectionSocket.write('already connected');
                  console.log("deja connecté");
                  connectionInformation.connectionSocket.write("error deja connecté"); //important pour debloquer le terminal du client
                  return;
            };
            // else

            // verifie que le user existe: 
            if (!existUser(username)) {
                  console.log("pas de user avec le nom " + username);
                  socket.write(`Error (code) : pas d'utilisateur avec le nom ${username}`)
                  return;
            }

            // else
            connectionInformation.user = username; 
            // --> NON On doit faire apres password
            connectionInformation.connectionSocket.write('331 User name okay, need password.\r\n');
            return;
      }
      console.log("pas de socket, pas de connection");
}

function existUser(username) {
      // return Object.keys(users).includes(username);
      return users.hasOwnProperty(username);
}

commands.add(name, helpText, description, userFunction);

module.exports = { userFunction };