const { pwdFunction } = require('./commands/pwd')
const { listFunction } = require('./commands/list')
const { pasvFunction } = require('./commands/pasv')


async function handleClientCommand(connectionInformation) {
      //lancer d'abord une premiere fonction pour pwd, ls etc... l'initialisation
      while (true) {
            let data = await connectionInformation.questionFunction("");
            let dataSplit = data.toString().split(" ");
            let command = dataSplit[0].trim().toUpperCase();
            // console.log(`command : ${command}`);
            switch (command) {
                  case "PWD":
                        await pwdFunction(connectionInformation);
                        break;
                  case "LIST":
                        pasvFunction(connectionInformation);
                        // connectionInformation.dataSocketPromise.then(() => {
                              listFunction(connectionInformation);
                        // })
                        break;

                  default:
                        console.log("command no recognized");
                        break;
            }
      }

}

module.exports = {
      handleClientCommand,
};
