const commands = require('../command.js');
const fs = require('fs');

const name = 'RETR';
const helpText = 'RETR <sp> <pathname>';
const description = 'To donwload a specified file';

let isOnScope;
let finalPath;

function retrFunction(connectionInformation, path) {
      const rootDir = connectionInformation.rootDirectory;
      let currentDir;
      if (path.charAt(0) == "/") {
            currentDir = rootDir;
      }
      else {
            currentDir = connectionInformation.currentDirectory;
      };
      // cf cwd

      isOnScopeFun(rootDir, currentDir, path);
      if (!isOnScope) {
            console.log("non-existant path for the user");
            connectionInformation.connectionSocket.write("550 File not found\r\n");
            return;
      };

      if (!(fs.existsSync(finalPath) && fs.lstatSync(finalPath).isFile())) {
            console.log(`${finalPath}doesn't exist or is not a file`);
            connectionInformation.connectionSocket.write("550 file action not taken\r\n");
            return;
      };
      // else
      let transferMode;
      if(connectionInformation.type == "A") transferMode = 'ascii'
      else transferMode = 'binary'
      
      console.log(`final path avant filestream [${finalPath}]`);
      // add try-catch
      const fileStream = fs.createReadStream(finalPath, {encoding: transferMode}); // need to specify the mode
      // const fileStream = fs.createReadStream(finalPath); // need to specify the mode
      fileStream.pipe(connectionInformation.dataSocket);
      connectionInformation.connectionSocket.write('226 Transfer complete\r\n');
};


function isOnScopeFun(rootDir, currentDir, path) {
      let dir = currentDir.replace(rootDir, "");
      dir = dir.split("/").filter(str => str.trim() !== "");; // psq si dir commence par "" apres split on a le 1er elt vide
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
      dir = "/" + dir.join("/");
      dir = rootDir + dir;
      finalPath = dir;
      // console.log(`finalPath ${finalPath}`);
};

commands.add(name, helpText, description, retrFunction);