const commands = require('../command.js');

const name = 'TYPE';
const helpText = 'TYPE <"A" or "I">';
const description = 'To change type of data exchanged (binary or ascii)';

function typeFunction(connectionInformation, dataType) {
      connectionInformation.client.write(`TYPE ${dataType}\r\n`);

      connectionInformation.client.once('data',(data)=> {
            console.log(`${data}`);
            //extraire le  code et  la reeponse
            // mettre la reponse dans connectionInformation
      });
};


commands.add(name, helpText, description, typeFunction);