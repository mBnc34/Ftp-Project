const commands = require('../command.js');
const colors = require('ansi-colors');

const name = 'DELE';
const helpText = 'DELE <ps> <pathname>';
const description = 'To delete a file from the server';

function deleFunction(connectionInformation, path) {
      connectionInformation.client.write(`DELE ${path}\r\n`);

      connectionInformation.client.once('data', (data) => {
            if (data.toString().startsWith('250')) {
                  console.log(colors.bold.green(`file ${path} successfully deleted\n\n`));
            }
            else{
                  console.log(colors.bold.green("error on the path or inside server\n\n"));
            }
      });
}



commands.add(name, helpText, description, deleFunction);