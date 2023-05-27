const commands = require('../command.js');
const net = require('net');

const name = 'QUIT';
const helpText = 'QUIT';
const description = 'To close the connection';

function quitFunction(connectionInformation) {
      connectionInformation.connectionSocket.write("221 Goodbye.\r\n");
      connectionInformation.connectionSocket.end();
      //peut etre utiliser une fonction de reinitialisation de l'obj connectionInfo
      //car peut etre cet objet va etre reutiliser
}


commands.add(name, helpText, description, quitFunction);