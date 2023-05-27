const commands = require('../command.js');

const name = 'MKD';
const helpText = 'MKD <sp> <pathname>';
const description = 'To create a directory';

function mkdFunction(connectionInformation, path) {
      connectionInformation.client.write(`MKD ${path}\r\n`);

      connectionInformation.client.once('data', (data) => {
            console.log(`${data}`);
      });
};


commands.add(name, helpText, description, mkdFunction);