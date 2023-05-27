const commands = require('./command');
require('./commands/INDEX.js'); // apres enlever et creer des index.js dans chaque rep pour import les fichiers necessaire
// console.log(commands.myCommands);

async function handleClientCommand(connectionInformation) {
      // when the user is connected we show the path and the list automaticaly (the first time)
      commands.myCommands["PWD"].callback(connectionInformation);

      while (true) {
            let data = await connectionInformation.questionFunction(``);
            let dataSplit = data.toString().split(/\s+/);
            let command = dataSplit[0].trim().toUpperCase();

            switch (command) {
                  case "MODE":
                        const dataMode = dataSplit[1].trim();
                        // console.log(`dataMode : ${dataMode}`);
                        await commands.myCommands["MODE"].callback(connectionInformation, dataMode);
                        break;
                  case "PWD":
                        commands.myCommands["PWD"].callback(connectionInformation);
                        break;
                  case "LIST":
                  case "LS":
                        await commands.myCommands[connectionInformation.connectionMode].callback(connectionInformation);
                        await commands.myCommands["LIST"].callback(connectionInformation);
                        break;
                  case "CWD":
                  case "CD":
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
                        let fileNameStor = dataSplit.length === 1 ? "" : dataSplit[1].trim().toString();
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
                        return;
                        break;
                  default:
                        console.log("command no recognized\n");
                        break;
            }
      }
}

module.exports = {
      handleClientCommand,
};
