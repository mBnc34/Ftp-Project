const commands = require('../command.js');
const fs = require('fs');

const name = 'RNTO';
const helpText = 'RNTO <sp> <pathname>';
const description = 'To indicate the new name of a file/directory after RNFR command';


/*
For the moment i just rename without move ...
So i can have error if the data in RNTO is not just a name but a path
put more code for control
 */

function rntoFunction(connectionInformation, newName) {
      let newPath = connectionInformation.rnfrPath.split("/").filter(str => str.trim() !== "");
      newPath[newPath.length - 1] = newName; 
      newPath = newPath.join("/");
      console.log(`newPath : ${newPath}`);
      fs.rename(connectionInformation.rnfrPath,newPath, (err)=> {
            if (err) {
                  console.log(err);
                  connectionInformation.connectionSocket.write('451 Requested action aborted: local error in processing.\r\n');
            } else {
                  console.log("file rename succesfully");
                  connectionInformation.rnfrPath = ''; //reinitialise
                  connectionInformation.connectionSocket.write(`250 file exists \r\n`);
            }
      })
};

commands.add(name, helpText, description, rntoFunction);