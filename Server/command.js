
/*
 * entry point for command
 * and each command in own file add on our commands object
 */

// Array object of all commands. Each command have his own object
var commands = {};

/**
 * Register a command
 * @param {!string} commandName 
 * @param {string} helptext 
 * @param {string} description
 * @param {!callable} callback 
 */
exports.add = function (commandName, helptext, description, callback) {


      // Vérification si l'utilisateur existe déjà
      if (commands.hasOwnProperty(commandName)) {
            console.error(`Command ${commandName} already exists`);
            return;
      }
      // add the command :
      commands[commandName.toUpperCase()] = {
            // commandName: commandName.toUpperCase(),
            helptext: helptext,
            description: description,
            callback: callback
      };

      console.log(commands);
      commands[commandName].callback("testfs");
};

/**
 * Unregister a command.
 * @param {!string} command
 */
exports.remove = function (command) {
      delete commands[command];
};

/**
 * Check if the given command exists.
 * @param {!string} command
 * @return {boolean}
 */
exports.exists = function (command) {
      return typeof (commands[command.toUpperCase()]) !== 'undefined';
};

/**
 * Return the help text for the given command.
 * @param {!string} command
 * @return {string}
 */
exports.help = function (command) {
      return commands[command.toUpperCase()].helpText;
};

// create the fucntion that react to command received :