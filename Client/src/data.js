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
                        let pwdPath = dataSplit.length === 1 ? "" : dataSplit[1].trim().toString();
                        commands.myCommands["PWD"].callback(connectionInformation, pwdPath);
                        break;
                  case "LIST":
                        await commands.myCommands[connectionInformation.connectionMode].callback(connectionInformation);
                        // connectionInformation.dataSocketPromise.then(() => {
                        await commands.myCommands["LIST"].callback(connectionInformation);
                        // })
                        break;
                  case "CWD":
                        let cwdPath = dataSplit.length === 1 ? "" : dataSplit[1].trim().toString();
                        commands.myCommands["CWD"].callback(connectionInformation, cwdPath);
                        break;
                  case "RMD":
                        let rmdPath = dataSplit.length === 1 ? "" : dataSplit[1].trim().toString();
                        commands.myCommands["RMD"].callback(connectionInformation, rmdPath);
                        break;
                  case "MKD":
                        let mkdPath = dataSplit.length === 1 ? "" : dataSplit[1].trim().toString();
                        commands.myCommands["MKD"].callback(connectionInformation, mkdPath);
                        break;
                  case "DELE":
                        let delePath = dataSplit.length === 1 ? "" : dataSplit[1].trim().toString();
                        commands.myCommands["DELE"].callback(connectionInformation, delePath);
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
                  case "QUIT":
                        connectionInformation.client.write("QUIT");
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
