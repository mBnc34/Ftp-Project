const commands = require('../command.js');

const name = 'CWD';
const helpText = 'CWD <sp> <pathname>';
const description = 'To change the working directory';

function cwdFunction(connectionInformation, path) {
      connectionInformation.client.write(`CWD ${path}\r\n`);
      connectionInformation.client.once('data',(data)=> {
            console.log(`${data}`);
            //extraire le  code et  la reeponse
            // mettre la reponse dans connectionInformation
      });
};

commands.add(name, helpText, description, cwdFunction);