const commands = require('../command.js');
const fs = require('fs');


const name = 'DELE';
const helpText = 'DELE <ps> <pathname>';
const description = 'To delete a file from the server';

let isOnScope;
let finalPath;

function deleFunction(connectionInformation, path) {
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
      if (!(fs.existsSync(finalPath) && fs.lstatSync(finalPath).isFile())) {
            console.log(`${finalPath} n'existe pas ou n'est pas un fichier`);
            connectionInformation.connectionSocket.write("550 + msg\r\n");
            return;
      };

      fs.rm(finalPath, (err)=> {
            if (err) {
                  console.log(err);
                  connectionInformation.connectionSocket.write("550 + msg\r\n")
            } else {
                  console.log("fichier delete avec succés");
                  connectionInformation.connectionSocket.write(`250 ${path} deleted \r\n`);
            }
      })
};


function isOnScopeFun(rootDir, currentDir, path) {
      let dir = currentDir.replace(rootDir, "");
      dir = dir.split("/").filter(str => str.trim() !== "");; // psq si dir commence par "" apres split on a le 1er elt vide
      let pathArr = path.split("/").filter(str => str.trim() !== "");  //faire un msg si "/" au debut de path --> error

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
};

commands.add(name, helpText, description, deleFunction);