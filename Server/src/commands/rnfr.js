const commands = require('../command.js');
const fs = require('fs');

const name = 'RNFR';
const helpText = 'RNFR <sp> <pathname>';
const description = "To indicate the name of a file OR a directory you wan't to rename";

let isOnScope;
let finalPath;

function rnfrFunction(connectionInformation, path) {
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
      }
      else if (!(fs.existsSync(finalPath))) {
            console.log(`${finalPath} doesnt exist `);
            connectionInformation.connectionSocket.write("550 file action not taken\r\n");
            return;
      };

      connectionInformation.rnfrPath = finalPath;
      connectionInformation.connectionSocket.write("350 Requested file action pending further information.\r\n");
    
};

function isOnScopeFun(rootDir, currentDir, path) {
      let dir = currentDir.replace(rootDir, "");
      dir = dir.split("/").filter(str => str.trim() !== ""); // psq si dir commence par "" apres split on a le 1er elt vide
      let pathArr = path.split("/").filter(str => str.trim() !== "");  //faire un msg si "/" au debut de path --> error

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
};

commands.add(name, helpText, description, rnfrFunction);