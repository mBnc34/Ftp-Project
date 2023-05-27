const commands = require('../command.js');
const fs = require('fs');

const name = 'LIST';
const helpText = 'LIST [<sp> pathname]';
const description = 'List all files in a specified directory';

let isOnScope;
let finalPath;


function listFunction(connectionInformation, path) {

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

      if (!(fs.existsSync(finalPath) && fs.lstatSync(finalPath).isDirectory())) {
            console.log(`${finalPath}doesn't exist or is not directory`);
            connectionInformation.connectionSocket.write("550 file action not taken\r\n");
            return;
      };
      // else


      // console.log(`final path${finalPath}`);
      fs.readdir(finalPath, (err, files) => {
            if (err) {
                  connectionInformation.connectionSocket.write('451 Requested action aborted: local error in processing.\r\n');
                  connectionInformation.dataSocket.end();
                  return;
            }

            let response = formatList(finalPath, files);
            // let binaryData = Buffer.from(response, 'binary');
            // binaryData = binaryData.toString('hex');
            
            // console.log(`response : \n${response}`);
            try {
                  connectionInformation.dataSocket.write(response, 'ascii', () => {
                        connectionInformation.dataSocket.end();
                        connectionInformation.connectionSocket.write('226 Transfer complete\r\n');
                  });

            } catch (error) {
                  console.log(error);
                  connectionInformation.connectionSocket.write("425 Can't open data connection.\r\n");
                  connectionInformation.dataSocket.end();
                  // return;
            }

      });

      // connectionInformation.connectionSocket.write('150 File status okay\r\n');
};


function formatList(pathDir, files) {
      let response = '';
      files.forEach((file) => {
            let pathFile = pathDir.toString() + "/" + file.toString();
            let stats = fs.statSync(pathFile);
            let type;
            if (fs.statSync(pathFile).isDirectory()) {
                  type = "d";
            } else if (fs.statSync(pathFile).isFile()) {
                  type = "-";
            }

            const typeFile = fs.statSync(pathFile).isDirectory() ? 'd' : '-';
            const name = file.toString();
            const fileSize = stats.size / 1000; //from octet to kO
            const mtime = fs.statSync(pathFile).mtime.toISOString().replace('T', ' ').replace(/\.\d+Z/, '').split(" ").shift();

            response += `${type}rw-r--r-- 1 owner group ${fileSize} ${mtime} ${name}\r\n`;
      });

      return response;
}


function isOnScopeFun(rootDir, currentDir, path) {
      let dir = currentDir.replace(rootDir, "");
      dir = dir.split("/").filter(str => str.trim() !== ""); // psq si dir commence par "" apres split on a le 1er elt vide
      let pathArr = path.split("/").filter(str => str.trim() !== "");


      for (str of pathArr) {
            if (str === "." || str === "..") {
                  if (dir.length == 0) {
                        ;
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

};

commands.add(name, helpText, description, listFunction);

