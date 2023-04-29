// const { server } = require('./server');
const fs = require('fs');

const commands = require('./command');
require('./commands/index.js'); // apres enlever et creer des index.js dans chaque rep pour import les fichiers necessaire
console.log(commands.myCommands);
// console.log(users);



function handleUserCommand(connectionInformation, data) {

    const socket = connectionInformation.connectionSocket;
    const user = connectionInformation.user;

    const dataSplit= data.toString().split(" ");
    const command = dataSplit[0].trim();

    //apres au lieu de if / else if etc
    // soit faire un case soit utilliser un objet

    if (command === "OPTS"){
      console.log("encoding " + dataSplit[1] + " " + dataSplit[2] );
      socket.write('code + Server Ready!\r\n'); // pour debloquer le client
    }
    else if (command === 'USER') {
      const username = dataSplit[1].trim();
      commands.myCommands["USER"].callback(connectionInformation,username);  

    } else if (command === 'PASS') {
      const password = dataSplit[1].trim();
      commands.myCommands["PASS"].callback(connectionInformation,password);
    
    } else {
      socket.write('500 Invalid command.\r\n');
    }

}

module.exports = {
  handleUserCommand,
};
