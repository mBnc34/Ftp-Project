import inquirer from 'inquirer';

inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: 'Quel est votre nom ?'
  },
  {
    type: 'list',
    name: 'gender',
    message: 'Quel est votre genre ?',
    choices: ['Homme', 'Femme', 'robot']
  },
  {
    type: 'checkbox',
    name: 'hobbies',
    message: 'Quels sont vos hobbies ?',
    choices: ['Lecture', 'Voyages', 'Sport', 'Cinéma']
  }
]).then((answers) => {
  console.log('Nom:', answers.name);
  console.log('Genre:', answers.gender);
  console.log('Hobbies:', answers.hobbies);
});
