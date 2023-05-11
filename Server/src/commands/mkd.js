const commands = require('../command.js');
const fs = require('fs');

const name = 'MKD';
const helpText = 'MKD <sp> <pathname>';
const description = 'To create a directory';


let isOnScope;
let finalPath; //chemin sans le directoire créé
let finalFileDir; //chemin avec le directoire créé


function mkdFunction(connectionInformation, path) {
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
      if (fs.existsSync(finalFileDir)){
            console.log(`${finalFileDir} est déja un chemin existant`);
            connectionInformation.connectionSocket.write("550 + msg\r\n");
            return;
      }

      fs.mkdir(finalFileDir, (err)=> {
            if (err) {
                  console.log(err);
                  connectionInformation.connectionSocket.write("550 + msg\r\n")
            } else {
                  console.log("Repertoire créé avec succés");
                  connectionInformation.connectionSocket.write(`257 ${path} created \r\n`);
            }
      })

}


function isOnScopeFun(rootDir, currentDir, path) {
      let dir = currentDir.replace(rootDir, "");
      dir = dir.split("/").filter(str => str.trim() !== "");; // psq si dir commence par "" apres split on a le 1er elt vide
      let pathArr = path.split("/").filter(str => str.trim() !== "");  //faire un msg si "/" au debut de path --> error

      const dirName = pathArr.pop();
      console.log(`filename ${dirName}`);

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
            finalFileDir = finalPath + dirName.toString();
      }
      else {
            finalFileDir = finalPath + "/" + dirName.toString();
      }
      // console.log(`finalPath ${finalPath}`);
};

commands.add(name, helpText, description, mkdFunction);