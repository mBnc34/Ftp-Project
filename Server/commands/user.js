const { add } = require('../command');
const users = require('../Users/users.json');
const {user, connectionSocket, server} = require('../server');

const name = 'USER';
const helpText = 'USER <sp> <username>';
const description = 'To authenticate';

function userFunction (username) {
      if(connectionSocket != null){
             // console.log(message);
      if (user) {
            // message d'erreur : already connected
            connectionSocket.write('already connected')
            console.log("deja connecté");
            return;
      };
      // else

      // verifie que le user existe: 
      if (!existUser(username)){
            // message d'erreur : le user n'existe pas
            // peut-etre faire apres pass.
            console.log("user doesnt exist");
            connectionSocket.write("user doesn't exist");
            return;
      }

      // else
      console.log("ici");
      connectionSocket.write("j'attends pass;")
      // message pour dire d'ecrire PASS + password
      // serveur en ecoute de data
      // appelé passFunction
      }
     console.log("pas de socket, pas de connection");
}

function existUser(username){
      return Object.keys(users).includes(username);
}

add(name, helpText, description, userFunction);

module.exports = {userFunction};