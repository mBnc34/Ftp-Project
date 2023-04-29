// const { server } = require('./server');
const fs = require('fs');
const usersFile = 'C:/Users/mouss/Desktop/Ftp-Project/Server/Users/users.json';
const rawData = fs.readFileSync(usersFile);
const users = JSON.parse(rawData);
const bcrypt = require('bcrypt');
const commands = require('./command');
require('./commands/index.js'); // apres enlever et creer des index.js dans chaque rep pour import les fichiers necessaire
console.log(commands.myCommands);
// console.log(users);



function handleUserCommand(connectionInformation, data) {

    const socket = connectionInformation.connectionSocket;
    const user = connectionInformation.user;

    const dataSplit= data.toString().split(" ");
    const command = dataSplit[0].trim();

    if (command === "OPTS"){
      console.log("encoding " + dataSplit[1] + " " + dataSplit[2] );
      socket.write('Server Ready!\r\n'); // pour debloquer le client
    }
    else if (command === 'USER') {
      const username = dataSplit[1].trim();
      commands.myCommands["USER"].callback(connectionInformation,username);  

    } else if (command === 'PASS') {

      const password = dataSplit[1].trim();
      const userPass = users[user].password;
      const match = bcrypt.compareSync(password,userPass); // l'ordre COMPTE ICI ATTENTION

      if(match){
        connectionInformation.isConnected = true;
        socket.write('230 Login successful.\r\n');
        return;
      }
      //else
      connectionInformation.user = null; //reinitialiser le user
      socket.write('431 Invalid password. \r\n');
    
    } else {
      socket.write('500 Invalid command.\r\n');
    }

}

module.exports = {
  handleUserCommand,
};
