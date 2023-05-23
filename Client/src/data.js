const commands = require('./command');
require('./commands/INDEX.js'); // apres enlever et creer des index.js dans chaque rep pour import les fichiers necessaire
console.log(commands.myCommands);

async function handleClientCommand(connectionInformation) {
      //lancer d'abord une premiere fonction pour pwd, ls etc... l'initialisation
      while (true) {
            let data = await connectionInformation.questionFunction("");
            // console.log(`data : ${data}`);
            let dataSplit = data.toString().split(" ");
            let command = dataSplit[0].trim().toUpperCase();
            // console.log(`command : ${command}`);
            switch (command) {
                  case "MODE":
                        const dataMode = dataSplit[1].trim();
                        // console.log(`dataMode : ${dataMode}`);
                        await commands.myCommands["MODE"].callback(connectionInformation, dataMode);
                        break;
                  case "PWD":
                        await commands.myCommands["PWD"].callback(connectionInformation);
                        break;
                  case "LIST":
                        await commands.myCommands[connectionInformation.connectionMode].callback(connectionInformation);
                        // connectionInformation.dataSocketPromise.then(() => {
                        await commands.myCommands["LIST"].callback(connectionInformation);
                        // })
                        break;
                  case "STOR":
                        const fileNameStor = dataSplit[1].trim();
                        await commands.myCommands[connectionInformation.connectionMode].callback(connectionInformation);
                        await commands.myCommands["STOR"].callback(connectionInformation, fileNameStor);

                        break;
                  case "RETR":
                        const fileNameRetr = dataSplit[1].trim();
                        await commands.myCommands[connectionInformation.connectionMode].callback(connectionInformation);
                        await commands.myCommands["RETR"].callback(connectionInformation, fileNameRetr);
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
