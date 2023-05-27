
/*
 * entry point for command
 * and each command in own file add on our commands object
 */

// Array object of all commands. Each command have his own object
var myCommands = {};

exports.myCommands = myCommands;

/**
 * Register a command
 * @param {!string} commandName 
 * @param {string} helptext 
 * @param {string} description
 * @param {!callable} callback 
 */
exports.add = function (commandName, helptext, description, callback) {


      // check if we already have this command
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
};

