const commands = require('../command.js');
const fs = require('fs');


const name = 'STOR';
const helpText = 'STOR <sp> pathname';
const description = 'To upload a specified file';

let isOnScope;
let finalPath;

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

      let transferMode;
      if(connectionInformation.type == "A") transferMode = 'ascii'
      else transferMode = 'binary'

      // console.log(`final path avant filestream de stor[${finalPath}]`);
      // const fileStream = fs.createWriteStream(finalPath, { encoding: transferMode }); // Mode binaire
      // fileStream.pipe(connectionInformation.dataSocket);
      connectionInformation.connectionSocket.write('226 Transfer complete\r\n');
}

// a changer car la on ne veut que un dir pas un file
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
      // console.log(`finalPath ${finalPath}`);
};

commands.add(name, helpText, description, storFunction);