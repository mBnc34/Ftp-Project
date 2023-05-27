const commands = require('../command.js');
const fs = require('fs');

const name = 'STOR';
const helpText = 'STOR <sp> pathname';
const description = 'To upload a specified file';

let isOnScope;
let finalPath;
let finalFileDir;

function storFunction(connectionInformation, path) {
      const rootDir = connectionInformation.rootDirectory;
      let currentDir;
      if (path.charAt(0) === '/') {
            currentDir = rootDir;
      } else {
            currentDir = connectionInformation.currentDirectory;
      }
      isOnScopeFun(rootDir, currentDir, path);
      if (!isOnScope) {
            console.log('Non-existent path for the user');
            connectionInformation.connectionSocket.write('550 File not found\r\n');
            return;
      }
      if (!(fs.existsSync(finalPath) && fs.lstatSync(finalPath).isDirectory())) {
            console.log(`${finalPath} doesn't exist or is not a directory`);
            connectionInformation.connectionSocket.write('550 File action not taken\r\n');
            return;
      }

      const writeStream = fs.createWriteStream(finalFileDir);

      if (!writeStream.writable) {
            console.error(`Write stream is not writable: ${finalFileDir}`);
            connectionInformation.connectionSocket.write('425 Can\'t open data connection.\r\n');
            return;
      }

      writeStream.on('finish', () => {
            console.log(`File upload completed: ${finalFileDir}`);
            connectionInformation.connectionSocket.write('226 Transfer complete\r\n');
      });

      try {
            connectionInformation.dataSocket.on('data', (data) => {
                  writeStream.write(data);
            });
      } catch (error) {
            console.log(error);
      }

      //if problem put on instead of once ?
      connectionInformation.dataSocket.once('end', () => {
            writeStream.end();
      });
}

function isOnScopeFun(rootDir, currentDir, path) {
      let dir = currentDir.replace(rootDir, '');
      dir = dir.split('/').filter(str => str.trim() !== '');

      const pathArr = path.split('/').filter(str => str.trim() !== '');

      const fileName = pathArr.pop();

      for (const str of pathArr) {
            if (str === '.' || str === '..') {
                  if (dir.length === 0) {
                        finalPath = null;
                        isOnScope = false;
                        return;
                  } else {
                        dir.pop();
                  }
            } else {
                  dir.push(str);
            }
      }

      isOnScope = true;
      dir = '/' + dir.join('/');
      dir = rootDir + dir;
      finalPath = dir;

      if (finalPath.trim().charAt(finalPath.length - 1) === '/') {
            finalFileDir = finalPath + fileName.toString();
      } else {
            finalFileDir = finalPath + '/' + fileName.toString();
      }
}

commands.add(name, helpText, description, storFunction);
