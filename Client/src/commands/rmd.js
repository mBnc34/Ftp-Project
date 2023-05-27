const commands = require('../command.js');
const colors = require('ansi-colors');

const name = 'RMD';
const helpText = 'RMD <sp> <pathname>';
const description = 'To remove a directory';

function rmdFunction(connectionInformation, path) {
      // cannot delete the actual dir --> move before (this way we also avoid delete the rootDirectory)
      if (path != "") {
            connectionInformation.client.write(`RMD ${path}\r\n`);

            connectionInformation.client.once('data', (data) => {
                  if (data.toString().startsWith('250')) {
                        console.log(colors.bold.green(`dir ${path} successfully deleted\n\n`));
                  }
                  else {
                        console.log(colors.bold.green("error on the path or inside server\n\n"));
                  }
            });
      } else {
            console.log("cannot remove the current directory, need to move before");
      }
}



commands.add(name, helpText, description, rmdFunction);