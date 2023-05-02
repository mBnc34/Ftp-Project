const commands = require('../command.js');

// const fs = require('fs');

const name = 'PWD';
const helpText = 'PWD';
const description = 'Get the path to the working directory';

function pwdFunction(connectionInformation) {
      if(!connectionInformation.isConnected){
            connectionInformation.connectionSocket.write("530 not connected\r\n");
            return;
      }
      const path = "/" + connectionInformation.currentDirectory.replace(connectionInformation.rootDirectory,"");
      console.log("path pwd : "+ path);
      connectionInformation.connectionSocket.write(`257 ${path}\r\n`);
};

commands.add(name,helpText,description,pwdFunction);