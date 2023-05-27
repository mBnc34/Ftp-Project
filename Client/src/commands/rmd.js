const commands = require('../command.js');

const name = 'RMD';
const helpText = 'RMD <sp> <pathname>';
const description = 'To remove a directory';

function rmdFunction(connectionInformation, path) {
      // cannot delete the actual dir --> move before (this way we also avoid delete the rootDirectory)
      if (path != "") {
            connectionInformation.client.write(`RMD ${path}\r\n`);

            connectionInformation.client.once('data', (data) => {
                  console.log(`${data}`);
            });
      } else {
            console.log("cannot remove the current directory, need to move before");
      }
}



commands.add(name, helpText, description, rmdFunction);