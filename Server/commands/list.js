const commands = require('../command.js');

const fs = require('fs');
const name = 'LIST';
const helpText = 'LIST [<sp> pathname]';
const description = 'List all files in a specified directory';

// function listFunction(connectionInformation, path) {
//       const dir = connectionInformation.currentDirectory;
//       const result = "";

//       if (path == "") {
//             const dir = connectionInformation.currentDirectory;
//       }
//       else {
//             //utiliser le current directory
//             // si ./ on doit enlever un dir au current ...
//             // peut etre separer le dir avec "/" comme delimiteur
//       }

//       fs.readdir(dir, (err, files) => {
//             if (err) {
//                   connectionInformation.connectionSocket.write('500 code erreur + \r\n');
//                   return;
//             }

//             files.forEach(file => {
//                   result = result + file + " / ";
//             });
//             result = result.slice(0, -1);
//             // write une erreur
//       });
//       connectionInformation.connectionSocket.write('')

// }


/*
 * 
 * Autre  methode --> directement extraire la diff entre current et root
 * Si y'a trop de ../.. alors current est vide 
 * retourner une erreur quand on veut fair .. sur un tabeau vide
 * Commme cela on est plus precis
 */
function isOnScope(rootDir, currentDir, path) {
      let finalArr = currentDir.split("/");
      let pathArr = path.split("/");


      for (str of pathArr) {
            if (str == "." || str == "..") {
                  finalArr.pop();
            }
            else {
                  finalArr.push(str);
            }
      }

      //maintenant on reforme finalArr et on regarde si il comprent rootDir
      finalArr = finalArr.join("/"); //attention changement de type dynamique
      console.log(finalArr);
      if (finalArr.includes(rootDir)) return true;
      else return false;
}


// ou directement tt faire dans cette fonction et retourner le chemin final car  on fait push et pop deja 
function isOnScope2(rootDir, currentDir, path) {
      let dir = currentDir.replace(rootDir, "");
      dir = dir.split("/");
      if (dir[0] == "") dir = dir.slice(1);
      let pathArr = path.split("/");  //faire un msg si "/" au debut de path --> error
      // console.log(`pathArr ${pathArr}`);

      for (str of pathArr) {
            if (str === "." || str === "..") {
                  if (dir.length == 0) {
                        console.log("chemin non autorisé");
                        return false;
                  }
                  else {
                        dir.pop();
                  }
            }
            else {
                  dir.push(str);
            }
      }
      console.log(`finalDir ${dir}`);
      return true;
      // dir = "/" + dir.join("/");
      // console.log(`dir${dir}`);
      //concat root + dir

}


console.log(isOnScope2("A/B/C", "A/B/C/D", "./C2"));
console.log(isOnScope2("A/B/C", "A/B/C/D", "../../../../A"));
console.log(isOnScope2("A/B/C", "A/B/C/D", "E/F/G"));
console.log(isOnScope2("A/B/C", "A/B/C/D", "../../../../A/B/C/D"));
console.log(isOnScope2("A/B/C", "A/B/C/D", "../../../../A/B/"));