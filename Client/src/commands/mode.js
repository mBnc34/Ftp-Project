const commands = require('../command.js');
const colors = require('ansi-colors');

const name = 'MODE';
const helpText = 'MODE <"PASV" or "ACTIVE">';
const description = 'To change the connection Mode of data Socket';

// to allow user change the default mode of data transfer when he wants
function modeFunction(connectionInformation, data) {
      if (data == "PASV") {
            connectionInformation.connectionMode = "PASV";
            console.log(colors.bold.green("Connection mode is now PASSIVE\n\n"));
      } else if (data == "ACTIVE" || data == "PORT") {
            connectionInformation.connectionMode = "PORT";
            console.log(colors.bold.green("Connection mode is now ACTIVE\n\n"));
      }
      else {
            console.log(colors.bold.green("Mode Options Non-recognized\n\n"));
      }
}

commands.add(name, helpText, description, modeFunction);