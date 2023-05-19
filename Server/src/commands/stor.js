const commands = require('../command.js');
const fs = require('fs');


const name = 'STOR';
const helpText = 'STOR <sp> pathname';
const description = 'To upload a specified file';

let isOnScope;
let finalPath;
let finalFileDir;

/*
Probleme restant --> si un fichier a des espaces alors on perd de l'information du nom et surtout l'extension
aussi --> essayer de voir pour les types (ascii, utf ....)
*/

function storFunction(connectionInformation, path) {
      const rootDir = connectionInformation.rootDirectory;
      let currentDir;
      if (path.charAt(0) == "/") {
            currentDir = rootDir;
      }
      else {
            currentDir = connectionInformation.currentDirectory;
      };
      isOnScopeFun(rootDir, currentDir, path);
      if (!isOnScope) {
            console.log("non-existant path for the user");
            connectionInformation.connectionSocket.write("550 File not found\r\n");
            return;
      };
      if (!(fs.existsSync(finalPath) && fs.lstatSync(finalPath).isDirectory())) {
            console.log(`${finalPath}doesn't exist or is not directory`);
            connectionInformation.connectionSocket.write("550 file action not taken\r\n");
            return;
      };

      // let transferMode;
      // if (connectionInformation.type == "A") transferMode = 'ascii'
      // else transferMode = 'binary'

      const writeStream = fs.createWriteStream(finalFileDir);

      if (!writeStream.writable) {
            console.error(`write stream is not writable: ${finalFileDir}`);
            connectionInformation.dataSocket.end();
            return;
      };



      writeStream.on('finish', function () {
            connectionInformation.dataSocket.end();
      });

      // console.log("150 File status okay; about to open dataConnection");

      // connectionInformation.dataSocket.on('end', () => {
      //       connectionInformation.connectionSocket.write('226 Transfer complete.\n');
      //       // fileStream.end();
      //       console.log("end transfert");

      // });

      try {
            connectionInformation.dataSocket.on('data', (data) => {
                  // console.log(`dataStor : ${data}`);
                  writeStream.write(data);
                  // connectionInformation.dataSocket.write(data);
                  // console.log(`Received ${data.length} bytes of data.`);
                  // console.log(`stor received data \n${data}`);
            });
      } catch (error) {
            console.log(error);
            return;
            // connectionInformation.connectionSocket.write("425 Can't open data connection.\r\n");
      }
      connectionInformation.connectionSocket.write('226 Transfer complete\r\n');

}


function isOnScopeFun(rootDir, currentDir, path) {
      let dir = currentDir.replace(rootDir, "");
      dir = dir.split("/").filter(str => str.trim() !== ""); // psq si dir commence par "" apres split on a le 1er elt vide
      let pathArr = path.split("/").filter(str => str.trim() !== "");  //faire un msg si "/" au debut de path --> error

      const fileName = pathArr.pop();
      console.log(`filename ${fileName}`);

      for (str of pathArr) {
            if (str === "." || str === "..") {
                  if (dir.length == 0) {
                        finalPath = null;
                        isOnScope = false;
                        return;
                  }
                  else {
                        dir.pop();
                  }
            }
            else {
                  dir.push(str);
            }
      }
      isOnScope = true;
      dir = "/" + dir.join("/");
      dir = rootDir + dir;
      finalPath = dir;
      console.log(`final path ${finalPath}`);
      if (finalPath.trim().charAt(finalPath.length - 1) == "/") {
            finalFileDir = finalPath + fileName.toString();
      }
      else {
            finalFileDir = finalPath + "/" + fileName.toString();
      }

};

commands.add(name, helpText, description, storFunction);