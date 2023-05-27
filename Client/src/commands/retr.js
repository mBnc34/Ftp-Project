const commands = require('../command.js');
const fs = require('fs');
const colors = require('ansi-colors');

const name = 'RETR';
const helpText = 'RETR <sp> <pathname>';
const description = 'To download a specified file';

async function retrFunction(connectionInformation, fileName) {
      const rootDir = connectionInformation.rootDirectory;
      const filePath = rootDir + "/" + fileName;

      // start the transfer just when we have the dataSocket ready and avoid async errors
      connectionInformation.dataSocketPromise.then(() => {
            // inform the server
            connectionInformation.client.write(`RETR ${fileName}`);
            const writeStream = fs.createWriteStream(filePath);
            connectionInformation.client.once('data', (data) => {
                  if (data.toString().startsWith('550')) {
                        console.log(colors.bold.green(`error in path or server\n\n`));
                        connectionInformation.dataSocket.end();
                        connectionInformation.dataSocketPromise = null;
                        return;
                  }
                  else {
                        try {
                              connectionInformation.dataSocket.on('data', (data) => {
                                    writeStream.write(data);
                              });
                              console.log(colors.bold.green(`file ${fileName} successfully retrieved\n\n`));
                        } catch (error) {
                              console.log(error);
                              return;
                              // connectionInformation.connectionSocket.write("425 Can't open data connection.\r\n");
                        }
                  }
            })
      })
}


commands.add(name, helpText, description, retrFunction);