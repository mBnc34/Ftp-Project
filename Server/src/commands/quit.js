const commands = require('../command.js');

const name = 'QUIT';
const helpText = 'QUIT';
const description = 'To close the connection';

function quitFunction(connectionInformation) {
      connectionInformation.connectionSocket.write("221 Goodbye.\r\n");
      connectionInformation.connectionSocket.end();
}


commands.add(name, helpText, description, quitFunction);

