const commands = require('../command.js');
const fs = require('fs');

const name = 'CWD';
const helpText = 'CWD <sp> <pathname>';
const description = 'To change the workinng directory';

let isOnScope;
let finalPath;

function cwdFunction(connectionInformation, path) {
      console.log(`path cwd : ${path}`);
      const rootDir = connectionInformation.rootDirectory;
      let currentDir;
      if (path.charAt(0) == "/") {
            currentDir = rootDir;
      }
      else {
            currentDir = connectionInformation.currentDirectory;
      };
      // psq si "/" en premier ca veut dire que le path commence à la racine et pas au current dir
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

      // else
      // console.log(`current dir apres cwd ${finalPath}`);
      connectionInformation.currentDirectory = finalPath; // pour LIST et reinitialiser apres
      connectionInformation.connectionSocket.write("250 Directory succesfully changed\r\n");

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

};

commands.add(name, helpText, description, cwdFunction);