const commands = require('../command.js');
const fs = require('fs');

const name = 'CWD';
const helpText = 'CWD <sp> <pathname>';
const description = 'To change the working directory';

let isOnScope;
let finalPath;

function cwdFunction(connectionInformation, path) {
 
      const rootDir = connectionInformation.rootDirectory;
      let currentDir;

      // define the starting path
      if (path.charAt(0) == "/") {
            currentDir = rootDir;
      }
      else {
            currentDir = connectionInformation.currentDirectory;
      };

      //check if the user have acces and the path exists
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

      connectionInformation.currentDirectory = finalPath; //stor the actual path of the client
      connectionInformation.connectionSocket.write("250 Directory succesfully changed\r\n");

};


// to have some control on the path like no go before the rootPath ...
function isOnScopeFun(rootDir, currentDir, path) {

      let dir = currentDir.replace(rootDir, ""); 
      dir = dir.split("/").filter(str => str.trim() !== "");
      let pathArr = path.split("/").filter(str => str.trim() !== "");

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
      dir = "/" + dir.join("/"); // a part si dir vide ??
      dir = rootDir + dir;
      finalPath = dir;

};

commands.add(name, helpText, description, cwdFunction);