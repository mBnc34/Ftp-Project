const commands = require('../command.js');
const colors = require('ansi-colors');

const name = 'RENAME';
const helpText = 'RENAME';
const description = 'To rename a file';

async function renameFunction(connectionInformation) {
      let remoteFile = await getRemotePath(connectionInformation);
      connectionInformation.client.write(`RNFR ${remoteFile}\r\n`);
      await connectionInformation.client.once('data', (data) => {
            if (!data.toString().startsWith('350')) {
                  console.log(colors.bold.green("error on the path or inside server\n\n"));
                  return;
            }
      });

      // if the path is good :  
      let newName = await getNewName(connectionInformation);
      connectionInformation.client.write(`RNTO ${newName}\r\n`);
      await connectionInformation.client.once('data', (data) => {
            if (data.toString().startsWith('451')) {
                  console.log(colors.bold.green("error in the server`\n\n"));
            } else {
                  console.log(colors.bold.green(`file successfully rename in : "${newName}"\n\n`));
            }
      })
};

async function getRemotePath(connectionInformation) {
      return new Promise((resolve) => {
            connectionInformation.questionFunction(colors.bold.green('Path of the file int the server: ')).then((input) => {
                  resolve(input.toString());
            });
      });
};

async function getNewName(connectionInformation) {
      return new Promise((resolve) => {
            connectionInformation.questionFunction(colors.bold.green('New name: ')).then((input) => {
                  resolve(input.toString());
            });
      });
}

commands.add(name, helpText, description, renameFunction);