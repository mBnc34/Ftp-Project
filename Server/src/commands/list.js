const commands = require('../command.js');
const fs = require('fs');

const name = 'LIST';
const helpText = 'LIST [<sp> pathname]';
const description = 'List all files in a specified directory';

let isOnScope;
let finalPath;


function listFunction(connectionInformation, path) {


      if (connectionInformation.dataSocket == null){
            connectionInformation.connectionSocket.write("425 Can't open data connection.\r\n");
            return;
      }

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
            console.log("chemin inexistant pour le client");
            connectionInformation.connectionSocket.write("550 + msg\r\n");
            return;
      };

      if (!(fs.existsSync(finalPath) && fs.lstatSync(finalPath).isDirectory())) {
            console.log(`${finalPath} n'existe pas ou n'est pas un repertoire`);
            connectionInformation.connectionSocket.write("550 + msg\r\n")
            return;
      };
      // else

      // console.log(`final path avant readdir : ${finalPath}`);
      fs.readdir(finalPath, (err, files) => {
            if (err) {
                  connectionInformation.connectionSocket.write('425 code erreur + msg \r\n');
                  connectionInformation.dataSocket.end();
                  return;
            }

            let response = formatList(finalPath,files);
            // ports.socket.write(response, 'binary', () => {
            //       connectionInformation.dataSocket.end();
            // });
            // console.log(`response : \n${response}`);
            connectionInformation.dataSocket.write(response, 'ascii', () => {
                  connectionInformation.connectionSocket.write('226 Transfer complete\r\n');
                  connectionInformation.dataSocket.end();
            });
      });
      // connectionInformation.currentDirectory = rootDir;// on reinitialise
      connectionInformation.connectionSocket.write('150 transfer in progress\r\n');
};


function formatList(pathDir, files) {
      let response = '';
      files.forEach((file) => {
            let pathFile = pathDir.toString() + "/" + file.toString();
            let stats = fs.statSync(pathFile);
            let type;
            if (fs.lstatSync(pathFile).isDirectory()) {
                  type = "d";
                  // console.log(`${file} is directory`);
            } else if (fs.lstatSync(pathFile).isFile()) {
                  type = "-";
                  // console.log(`${file} is file`);
            }
            
            // Formater chaque fichier avec les informations requises par le protocole FTP
            // let fileMode = stats.mode.toString(8);
            const typeFile = fs.lstatSync(pathFile).isDirectory() ? 'd' : '-';
            // console.log(`typeFile : ${typeFile}`);
            const name = file.toString();
            // console.log(`name : ${name}`);
            const fileSize = stats.size/1000; //pour passer de octet à kOctet
            const mtime = fs.statSync(pathFile).mtime.toISOString().replace('T', ' ').replace(/\.\d+Z/, '').split(" ").shift();
            // console.log(`mtime : ${mtime}`);

            response += `${type}rw-r--r-- 1 owner group ${fileSize} ${mtime} ${name}\r\n`;
            // response += `${type} : ${file}  / size : ${fileSize}\r\n`;
      });

      return response;
}


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

commands.add(name, helpText, description, listFunction);

// isOnScopeFun("A/B/C", "A/B/C/D", "../C2")
// isOnScopeFun("A/B/C", "A/B/C/D", "../../../../A");
// isOnScopeFun("A/B/C", "A/B/C/D", "E/F/G");
// isOnScopeFun("A/B/C", "A/B/C/D", "../../../../A/B/C/D");
// isOnScopeFun("A/B/C", "A/B/C/D", "../../../../A/B/");