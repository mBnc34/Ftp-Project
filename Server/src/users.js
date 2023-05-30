const fs = require('fs');
const bcrypt = require('bcrypt');

// Création du fichier JSON pour stocker les informations des utilisateurs

// fs.writeFileSync(usersFile, '{}');
const usersFile = 'Server/src/Users/users.json';
const rawData = fs.readFileSync(usersFile);
const users = JSON.parse(rawData);

// add a user with his password hash
function addUser(username, password) {

  // check if user already exist 
  if (users.hasOwnProperty(username)) {
    console.error(`L'utilisateur ${username} existe déjà`);
    return;
  }

  // hash of the password
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error(`Erreur lors du hachage du mot de passe : ${err}`);
      return;
    }

    // add user with hash password
    users[username] = {
      user: username,
      password: hash
    };

    // write of the json file updated
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    console.log(`User ${username} was adding succesfully.`);
  });
}

// Exemple d'utilisation de la fonction addUser
addUser('usj', 'usj');
