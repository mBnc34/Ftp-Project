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
      connectionInformation.connectionSocket.write("150 transfer will start\r\n");
      let transferMode;
      if(connectionInformation.type == "A") transferMode = 'ascii'
      else transferMode = 'binary'


      // if (transferMode === 'binary') {
      //       const fileStream = fs.createReadStream(filePath, { highWaterMark: 1024 }); // Taille du tampon de 1 Ko pour le mode binaire
    
      //       fileStream.on('data', function(chunk) {
      //         client.write(chunk); // Envoyer les données au client
      //       });
    
      //       fileStream.on('end', function() {
      //         client.end(); // Terminer la transmission du fichier
      //       });
      //     } else if (transferMode === 'ascii') {
      //       const fileData = fs.readFileSync(filePath, 'utf8'); // Lire le fichier en tant que texte
    
      //       client.write(fileData); // Envoyer le contenu du fichier au client en tant que texte
    
      //       client.end(); // Terminer la transmission du fichier
      //     }
      
      console.log(`final path avant filestream [${finalPath}]`);
      // add try-catch
      // const fileStream = fs.createReadStream(finalPath, {encoding: transferMode}); // erreur pour le binaire
      const fileStream = fs.createReadStream(finalPath); // need to choose depending on "type" here it's like automatic
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