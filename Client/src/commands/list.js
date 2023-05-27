const commands = require('../command.js');
const colors = require('ansi-colors');

const name = 'LIST';
const helpText = 'LIST [<sp> pathname]';
const description = 'List all files in a specified directory';

async function listFunction(connectionInformation) {

      connectionInformation.dataSocketPromise.then(() => {
            connectionInformation.client.write("LIST");
            try {
                  connectionInformation.dataSocket.on('data', (data) => {
                        // to colors the directory in red (a file start with "-" in the response and a dir with "d")
                        console.log(`${data.toString().split('\n')
                              .map(line => (line.startsWith('d') ? colors.redBright(line) : line))
                              .join('\n')}\n`);
                  });

            } catch (error) {
                  console.log(error);
                  return;
                  // connectionInformation.connectionSocket.write("425 Can't open data connection.\r\n");
            }
      })

}

commands.add(name, helpText, description, listFunction);