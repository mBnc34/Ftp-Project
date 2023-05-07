const commands = require('../command.js');
const fs = require('fs');

// test pull
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
            console.log("chemin inexistant pour le client");
            connectionInformation.connectionSocket.write("550 + msg\r\n");
            return;
      };
      if (!(fs.existsSync(finalPath) && fs.lstatSync(finalPath).isDirectory())) {
            console.log(`${finalPath} n'existe pas ou n'est pas un repertoire`);
            connectionInformation.connectionSocket.write("550 + msg\r\n")
            return;
      };

      // let transferMode;
      // if (connectionInformation.type == "A") transferMode = 'ascii'
      // else transferMode = 'binary'
      // console.log(transferMode);

      // fs.createWriteStream(finalFileDir);
      const writeStream = fs.createWriteStream(finalFileDir);
      // const readStream = connectionInformation.dataSocket;

      if (!writeStream.writable) {
            console.error(`write stream is not writable: ${finalFileDir}`);
            connectionInformation.dataSocket.end();
            return;
      }

      // if (!readStream.readable) {
      //       console.error(`readstream stream is not readable: ${connectionInformation.dataSocket.remoteAddress}:${connectionInformation.dataSocket.remotePort}`);
      //       readStream.destroy();
      //       connectionInformation.dataSocket.end();
      //       return;
      // }

      // readStream.on('error', function (err) {
      //       console.error(`Read stream error: ${filePath}`);
      //       writeStream.destroy();
      //       connectionInformation.dataSocket.end();
      // });


      writeStream.on('finish', function () {
            // readStream.close();
            connectionInformation.dataSocket.end();
      });

      console.log("150 File status okay; about to open dataConnection");

      connectionInformation.dataSocket.on('end', () => {
            connectionInformation.connectionSocket.write('226 Transfer complete.\n');
            // fileStream.end();
            console.log("end transfert");

      });

      connectionInformation.dataSocket.on('data', (data) => {
            writeStream.write(data);
            // connectionInformation.dataSocket.write(data);
            // console.log(`Received ${data.length} bytes of data.`);
            // console.log(`stor received data \n${data}`);
      });

}

// a changer car la on ne veut que un dir pas un file
function isOnScopeFun(rootDir, currentDir, path) {
      let dir = currentDir.replace(rootDir, "");
      dir = dir.split("/").filter(str => str.trim() !== "");; // psq si dir commence par "" apres split on a le 1er elt vide
      let pathArr = path.split("/").filter(str => str.trim() !== "");  //faire un msg si "/" au debut de path --> error

      const fileName = pathArr.pop();
      console.log(`filename ${fileName}`);

      for (str of pathArr) {
            if (str === "." || str === "..") {
                  if (dir.length == 0) {
                        // console.log("chemin non autorisé");
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
      // console.log(finalPath.trim().charAt(finalPath.length -1));
      if (finalPath.trim().charAt(finalPath.length - 1) == "/") {
            finalFileDir = finalPath + fileName.toString();
      }
      else {
            finalFileDir = finalPath + "/" + fileName.toString();
      }
      // console.log(`finalPath ${finalPath}`);
};

commands.add(name, helpText, description, storFunction);