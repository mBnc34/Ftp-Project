const commands = require('./command');
require('./commands/INDEX.js'); // apres enlever et creer des index.js dans chaque rep pour import les fichiers necessaire
console.log(commands.myCommands);

async function handleClientCommand(connectionInformation) {
      //lancer d'abord une premiere fonction pour pwd, ls etc... l'initialisation
      while (true) {
            let data = await connectionInformation.questionFunction("");
            let dataSplit = data.toString().split(" ");
            let command = dataSplit[0].trim().toUpperCase();
            // console.log(`command : ${command}`);
            switch (command) {
                  case "PWD":
                        await commands.myCommands["PWD"].callback(connectionInformation);
                        break;
                  case "LIST":
                        await commands.myCommands["PASV"].callback(connectionInformation);
                        // connectionInformation.dataSocketPromise.then(() => {
                        await commands.myCommands["LIST"].callback(connectionInformation);
                        // })
                        break;
                  case "STOR":
                        const fileNameStor = dataSplit[1].trim();
                        await commands.myCommands["PASV"].callback(connectionInformation);
                        await commands.myCommands["STOR"].callback(connectionInformation, fileNameStor);

                        break;
                  case "RETR":
                        const fileNameRetr = dataSplit[1].trim();
                        await commands.myCommands["PASV"].callback(connectionInformation);
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
