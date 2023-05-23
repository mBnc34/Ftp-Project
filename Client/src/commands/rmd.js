const commands = require('../command.js');

const name = 'RMD';
const helpText = 'RMD <sp> <pathname>';
const description = 'To remove a directory';

function rmdFunction(connectionInformation, path) {
      if (path != "") {
            connectionInformation.client.write(`RMD ${path}\r\n`);

            connectionInformation.client.once('data',(data)=> {
                  console.log(`${data}`);
                  //extraire le  code et  la reeponse
                  // mettre la reponse dans connectionInformation
            });
      } else {
            console.log("cannot remove the current directory, need to move before");
      }
}



commands.add(name, helpText, description, rmdFunction);