const commands = require('../command.js');
const fs = require('fs');

const name = 'RMD';
const helpText = 'RMD <sp> <pathname>';
const description = 'To remove a directory';

let isOnScope;
let finalPath; //chemin sans le directoire créé

function rmdFunction(connectionInformation, path) {
      console.log(`path cwd : ${path}`);
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
            connectionInformation.connectionSocket.write("550 + msg\r\n");
            return;
      };

      fs.rmdir(finalPath, (err)=> {
            if (err) {
                  console.log(err);
            } else {
                  console.log("Repertoire supprimé avec succés");
                  connectionInformation.connectionSocket.write(`250 ${path} deleted \r\n`);
            }
      })

};


// cf list file to understand this function
function isOnScopeFun(rootDir, currentDir, path) {

      let dir = currentDir.replace(rootDir, ""); // get the path seen by the client
      dir = dir.split("/").filter(str => str.trim() !== "");
      let pathArr = path.split("/").filter(str => str.trim() !== "");

      for (str of pathArr) {
            // console.log(`str : ${str}`);
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
      dir = "/" + dir.join("/"); // a part si dir vide ??
      dir = rootDir + dir;
      finalPath = dir;
      console.log(`final path ${finalPath}`);

};

commands.add(name, helpText, description, rmdFunction);

