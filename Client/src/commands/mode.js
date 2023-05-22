const commands = require('../command.js');

const name = 'MODE';
const helpText = 'MODE <"PASV" or "ACTIVE">';
const description = 'To change the connection Mode of data Socket';

async function modeFunction(connectionInformation, data) {
      if (data == "PASV") {
            connectionInformation.connectionMode = "PASV";
      } else if(data == "ACTIVE" || data == "PORT") {
            connectionInformation.connectionMode = "PORT";
      }
      else{
            console.log("Mode Options Non-recognized");
      }
}

commands.add(name, helpText, description, modeFunction);