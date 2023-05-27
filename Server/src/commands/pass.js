const commands = require('../command.js');
const bcrypt = require('bcrypt');

const fs = require('fs');
const usersFile = 'Server/src/Users/users.json';
const rawData = fs.readFileSync(usersFile);
const users = JSON.parse(rawData);

const name = 'PASS';
const helpText = 'PASS <sp> <password>';
const description = 'To complete authentication, after USER command';


function passwordFunction(connectionInformation, password) {
      const userPass = users[connectionInformation.user].password;
      const match = bcrypt.compareSync(password,userPass); // l'ordre COMPTE ICI ATTENTION
      
      if(match){
            connectionInformation.isConnected = true;
            connectionInformation.connectionSocket.write('230 User logged in, proceed.\r\n');
            // appelé une fonction pour retr les droits et dossier de base
            return;
          }
          //else
          connectionInformation.user = null; 
      //     connectionInformation.connectionSocket.write('431 Invalid password.\r\n');
      connectionInformation.connectionSocket.write('530 Not logged In.\r\n');
};


commands.add(name, helpText, description, passwordFunction);
