// const { server } = require('./server');
const fs = require('fs');
const usersFile = 'C:/Users/mouss/Desktop/Ftp-Project/Server/Users/users.json';
const rawData = fs.readFileSync(usersFile);
const users = JSON.parse(rawData);
const bcrypt = require('bcrypt');

// console.log(users);



function handleUserCommand(connectionInformation, data) {

    // console.log(data.toString());
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

      if (!(users.hasOwnProperty(username))){
        console.log("pas de user avec le nom " + username);
        socket.write(`Error (code) : pas d'utilisateur avec le nom ${username}`)
        return;
      }
      //else
      connectionInformation.user = username; 
      // --> NON On doit faire apres password
      socket.write('331 User name okay, need password.\r\n');

    } else if (command === 'PASS') {

      const password = dataSplit[1].trim();
      console.log(`password ${password}`);
      // const passwordHash = bcrypt.hashSync(password,10);
      const userPass = users[user].password;
      // console.log(`userPass : ${userPass}`);
      const match = bcrypt.compareSync(password,userPass);//l'ordre COMPTE ICI
      console.log(`match : ${match}`);
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
