const commands = require('../command.js');
const colors = require('ansi-colors');

const name = 'CWD';
const helpText = 'CWD <sp> <pathname>';
const description = 'To change the working directory';

function cwdFunction(connectionInformation, path) {
      connectionInformation.client.write(`CWD ${path}\r\n`)
      connectionInformation.client.once('data', (data) => {

            if (data.toString().startsWith('250')) {
                  console.log(colors.bold.green(`successfully moved on ${path}!!\n`));
                  commands.myCommands[connectionInformation.connectionMode].callback(connectionInformation);
                  commands.myCommands["LIST"].callback(connectionInformation);
            } else {
                  console.log(colors.bold.green("error in path or server\n\n"));
            }
      });
};

commands.add(name, helpText, description, cwdFunction);