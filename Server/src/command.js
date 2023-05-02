
/*
 * entry point for command
 * and each command in own file add on our commands object
 */

// Array object of all commands. Each command have his own object
var myCommands = {};
// module.exports = {myCommands};
exports.myCommands = myCommands;
// pour l'instant j'export ca mais apres --> creer fonction get(...) pour avoir les commandes voulues

/**
 * Register a command
 * @param {!string} commandName 
 * @param {string} helptext 
 * @param {string} description
 * @param {!callable} callback 
 */
exports.add = function (commandName, helptext, description, callback) {


      // Vérification si l'utilisateur existe déjà
      if (myCommands.hasOwnProperty(commandName)) {
            console.error(`Command ${commandName} already exists`);
            return;
      }
      // add the command :
      myCommands[commandName.toUpperCase()] = {
            // commandName: commandName.toUpperCase(),
            helptext: helptext,
            description: description,
            callback: callback
      };

      // console.log(myCommands);
      // commands[commandName].callback("testfs");
};

/**
 * Unregister a command.
 * @param {!string} command
 */
exports.remove = function (command) {
      delete myCommands[command];
};

/**
 * Check if the given command exists.
 * @param {!string} command
 * @return {boolean}
 */
exports.exists = function (command) {
      return typeof (myCommands[command.toUpperCase()]) !== 'undefined';
};

/**
 * Return the help text for the given command.
 * @param {!string} command
 * @return {string}
 */
exports.help = function (command) {
      return myCommands[command.toUpperCase()].helpText;
};

// create the fucntion that react to command received :