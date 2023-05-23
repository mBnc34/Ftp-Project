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
                        console.log(`${data.toString().split('\n')
                              .map(line => (line.startsWith('d') ? colors.redBright(line) : line))
                              .join('\n')}\n`);
                        // console.log(`Received ${data.length} bytes of data.`);
                  });

            } catch (error) {
                  console.log(error);
                  return;
                  // connectionInformation.connectionSocket.write("425 Can't open data connection.\r\n");
            }
      })

}

commands.add(name, helpText, description, listFunction);