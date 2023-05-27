const commands = require('../command.js');

const name = 'PWD';
const helpText = 'PWD';
const description = 'Get the path to the working directory';

function pwdFunction(connectionInformation) {
      // console.log(`current dir :\n ${connectionInformation.currentDirectory}`);
      if(!connectionInformation.isConnected){
            connectionInformation.connectionSocket.write("530 not connected\r\n");
            return;
      }
      let path = connectionInformation.currentDirectory.replace(connectionInformation.rootDirectory,"");
      if (path.length == 0) path = "/";
      console.log("path pwd : "+ path);
      connectionInformation.connectionSocket.write(`257 ${path}\r\n`);
};

commands.add(name,helpText,description,pwdFunction);