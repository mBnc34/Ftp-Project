const fs = require('fs');
const bcrypt = require('bcrypt');

// Création du fichier JSON pour stocker les informations des utilisateurs
// const usersFile = "C:\Users\mouss\Desktop\Ftp-Project\Server\Users\users.json";
// fs.writeFileSync(usersFile, '{}');
const usersFile = 'C:/Users/mouss/Desktop/Ftp-Project/Server/Users/users.json';
const rawData = fs.readFileSync(usersFile);
const users = JSON.parse(rawData);

// Fonction pour ajouter un nouvel utilisateur avec un mot de passe haché
function addUser(username, password) {
  // Lecture du fichier JSON des utilisateurs
//   const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));

  // Vérification si l'utilisateur existe déjà
  if (users.hasOwnProperty(username)) {
    console.error(`L'utilisateur ${username} existe déjà`);
    return;
  }

  // Hachage du mot de passe avec bcrypt
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error(`Erreur lors du hachage du mot de passe : ${err}`);
      return;
    }

    // Ajout de l'utilisateur avec le mot de passe haché
    users[username] = {
      user: username,
      password: hash
    };

    // Écriture du fichier JSON mis à jour
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    console.log(`L'utilisateur ${username} a été ajouté avec succès.`);
  });
}

// Exemple d'utilisation de la fonction addUser
addUser('test', 'admin');
