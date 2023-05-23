const commands = require('../command.js');

const name = 'PWD';
const helpText = 'PWD';
const description = 'Get the path to the working directory';


async function pwdFunction(connectionInformation) {
      connectionInformation.client.write("PWD\r\n");

            connectionInformation.client.once('data',(data)=> {
                  console.log(`${data}`);
                  //extraire le  code et  la reeponse
                  // mettre la reponse dans connectionInformation
            });
};

commands.add(name,helpText,description,pwdFunction);