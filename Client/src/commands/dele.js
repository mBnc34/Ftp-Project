const commands = require('../command.js');

const name = 'DELE';
const helpText = 'DELE <ps> <pathname>';
const description = 'To delete a file from the server';

function deleFunction(connectionInformation, path) {
      connectionInformation.client.write(`DELE ${path}\r\n`);

      connectionInformation.client.once('data', (data) => {
            console.log(`${data}`);
      });
}



commands.add(name, helpText, description, deleFunction);