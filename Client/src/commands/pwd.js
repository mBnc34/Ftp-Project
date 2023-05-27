const commands = require('../command.js');
const colors = require('ansi-colors');

const name = 'PWD';
const helpText = 'PWD';
const description = 'Get the path to the working directory';


async function pwdFunction(connectionInformation) {
      connectionInformation.client.write("PWD\r\n");

      connectionInformation.client.once('data', (data) => {
            let dataSplit = data.toString().split(" ");
            let path = dataSplit[1]; // to  don't show the status code, just the path
            connectionInformation.pwd = path; // to be able to know the path on the code
            console.log(colors.bold.green(`${path}\n`));
      });
};

commands.add(name, helpText, description, pwdFunction);