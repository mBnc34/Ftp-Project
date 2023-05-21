const commands = require('../command.js');
const fs = require('fs');

const name = 'STOR';
const helpText = 'STOR <sp> pathname';
const description = 'To upload a specified file';

async function storFunction(connectionInformation, fileName) {
      const rootDir = connectionInformation.rootDirectory;
      const filePath = rootDir + "/" + fileName;

      connectionInformation.dataSocketPromise.then(() => {
            connectionInformation.client.write(`STOR ${fileName}`);
            const fileStream = fs.createReadStream(filePath);
            try {
                  fileStream.pipe(connectionInformation.dataSocket);
            } catch (error) {
                  console.log(error);
                  return;
            }
      })

}


commands.add(name, helpText, description, storFunction);