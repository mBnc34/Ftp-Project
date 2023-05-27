const commands = require('../command.js');
const colors = require('ansi-colors');

const name = 'MKD';
const helpText = 'MKD <sp> <pathname>';
const description = 'To create a directory';

function mkdFunction(connectionInformation, path) {
      connectionInformation.client.write(`MKD ${path}\r\n`);

      connectionInformation.client.once('data', (data) => {
            if (data.toString().startsWith('257')) {
                  console.log(colors.bold.green(`dir ${path} successfully created\n\n`));
            }
            else{
                  console.log(colors.bold.green("error on the path or inside server\n\n"));
            }
      });
};


commands.add(name, helpText, description, mkdFunction);