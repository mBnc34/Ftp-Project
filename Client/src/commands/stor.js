const commands = require('../command.js');
const fs = require('fs');

const name = 'STOR';
const helpText = 'STOR <sp> pathname';
const description = 'To upload a specified file';

let localFile;
let remoteFile;

async function storFunction(connectionInformation, fileName) {

    
      if (fileName === "") {
        if (await getLocalPath(connectionInformation)) {
          remoteFile = await getRemoteFile(connectionInformation);
        } else {
          return;
        }
      } else {
        if (await getLocalPath(connectionInformation)) {
          remoteFile = fileName;
        } else {
          return;
        }
      }
    
      connectionInformation.dataSocketPromise.then(() => {
        connectionInformation.client.write(`STOR ${remoteFile}`);
        console.log(`localfile : ${localFile}`);
        const fileStream = fs.createReadStream(localFile);
        try {
          fileStream.pipe(connectionInformation.dataSocket);
        } catch (error) {
          console.log(error);
          return;
        }
      });
    }
    
    async function getLocalPath(connectionInformation) {
      return new Promise((resolve) => {
        connectionInformation.questionFunction("localPath of the file : ").then((input) => {
          localFile = input.toString();
          localFile = connectionInformation.rootDirectory + "/" + localFile;
    
          if (!(fs.existsSync(localFile))) {
            console.log("File not found");
            connectionInformation.dataSocket.close();
            connectionInformation.dataSocket.end();
            resolve(false);
          } else {
            const stats = fs.statSync(localFile);
            if (!stats.isFile()) {
              console.log("Not a file");
              resolve(false);
            } else {
              resolve(true);
            }
          }
        });
      });
    }
    
    async function getRemoteFile(connectionInformation) {
      return new Promise((resolve) => {
        connectionInformation.questionFunction("remote of the file : ").then((input) => {
          resolve(input.toString());
        });
      });
    }
    


commands.add(name, helpText, description, storFunction);