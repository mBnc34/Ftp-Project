const commands = require('../command.js');
const fs = require('fs');

const name = 'MKD';
const helpText = 'MKD <sp> <pathname>';
const description = 'To create a directory';


let isOnScope;
let finalPath; //path of the directory where we will create the new dir
let finalFileDir; //path of the new dir


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
            console.log("non-existant path for the user");
            connectionInformation.connectionSocket.write("550 File not found\r\n");
            return;
      };
      if (!(fs.existsSync(finalPath) && fs.lstatSync(finalPath).isDirectory())) {
            console.log(`${finalPath}doesn't exist or is not directory`);
            connectionInformation.connectionSocket.write("550 file action not taken\r\n");
            return;
      };
      if (fs.existsSync(finalFileDir)){
            console.log(`${finalFileDir} already exist`);
            connectionInformation.connectionSocket.write("550 path already exist\r\n");
            return;
      }

      fs.mkdir(finalFileDir, (err)=> {
            if (err) {
                  console.log(err);
                  connectionInformation.connectionSocket.write('451 Requested action aborted: local error in processing.\r\n');
            } else {
                  console.log("dir created succesfully");
                  connectionInformation.connectionSocket.write(`257 ${path} created \r\n`);
            }
      })

}


function isOnScopeFun(rootDir, currentDir, path) {
      let dir = currentDir.replace(rootDir, "");
      dir = dir.split("/").filter(str => str.trim() !== ""); 
      let pathArr = path.split("/").filter(str => str.trim() !== "");  //faire un msg si "/" au debut de path --> error

      const dirName = pathArr.pop();
      console.log(`filename ${dirName}`);

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
      if (finalPath.trim().charAt(finalPath.length - 1) == "/") {
            finalFileDir = finalPath + dirName.toString();
      }
      else {
            finalFileDir = finalPath + "/" + dirName.toString();
      }

};

commands.add(name, helpText, description, mkdFunction);