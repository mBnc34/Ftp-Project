const commands = require('../command.js');

const name = 'TYPE';
const helpText = 'TYPE <"A" or "I">';
const description = 'To change type of data exchanged (binary or ascii)';

// to change default type use in transfer (in the future, now that have no effect because i defined ascii for list and binary for retr/stor)
function typeFunction(connectionInformation, dataType) {
      connectionInformation.client.write(`TYPE ${dataType}\r\n`);

      connectionInformation.client.once('data', (data) => {
            console.log(`${data}`);
      });
};


commands.add(name, helpText, description, typeFunction);