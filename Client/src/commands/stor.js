const commands = require('../command.js');
const fs = require('fs');
const colors = require('ansi-colors');

const name = 'STOR';
const helpText = 'STOR <sp> pathname';
const description = 'To upload a specified file';

let localFile;
let remoteFile;

async function storFunction(connectionInformation, fileName) {
  // to define what show to the user
  if (fileName === '') {
    if (await getLocalPath(connectionInformation)) {
      remoteFile = await getRemoteFile(connectionInformation);
    } else {
      connectionInformation.dataSocket.end();
      connectionInformation.dataSocketPromise = null;
      return;
    }
  } else {
    if (await getLocalPath(connectionInformation)) {
      remoteFile = fileName;
    } else {
      connectionInformation.dataSocket.end();
      connectionInformation.dataSocketPromise = null;
      return;
    }
  }


  return new Promise((resolve, reject) => {
    // start just if we have a data connection :
    connectionInformation.dataSocketPromise.then(() => {
      // send the command
      connectionInformation.client.write(`STOR ${remoteFile}`);
      const fileStream = fs.createReadStream(localFile);
      fileStream.on('error', (error) => {
        reject(error);
      });
      fileStream.on('end', () => {
        resolve(); // 
        console.log(colors.bold.green(`file ${fileName} successfully stored !!\n\n`));
      });
      // start the transfer
      fileStream.pipe(connectionInformation.dataSocket);
    });
  });
}

// ask the client the final path and check if it's a real path
async function getLocalPath(connectionInformation) {
  return new Promise((resolve) => {
    connectionInformation.questionFunction(colors.bold.green('localPath of the file : ')).then((input) => {
      localFile = input.toString();
      localFile = connectionInformation.rootDirectory + '/' + localFile;

      if (!fs.existsSync(localFile)) {
        console.log(colors.bold.green('File not found\n\n'));
        resolve(false);
      } else {
        const stats = fs.statSync(localFile);
        if (!stats.isFile()) {
          console.log(colors.bold.green('Not a file\n\n'));
          resolve(false);
        } else {
          resolve(true);
        }
      }
    });
  });
}

// where the client wan't to store on the server and with which name
async function getRemoteFile(connectionInformation) {
  return new Promise((resolve) => {
    connectionInformation.questionFunction(colors.bold.green('remotePath of the file : ')).then((input) => {
      resolve(input.toString());
    });
  });
}

commands.add(name, helpText, description, storFunction);
