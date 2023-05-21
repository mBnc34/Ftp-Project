const {pwdFunction} = require('./commands/pwd')


async function handleClientCommand(connectionInformation) {
      await pwdFunction(connectionInformation);
      //lancer d'abord une premiere fonction pour pwd, ls etc... l'initialisation
      while (true) {
            const command = await connectionInformation.questionFunction("");
            console.log(`command : ${command}`);
      }

}

module.exports = {
      handleClientCommand,
};
