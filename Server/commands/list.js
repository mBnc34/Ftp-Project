const commands = require('../command.js');

const fs = require('fs');
const name = 'LIST';
const helpText = 'LIST [<sp> pathname]';
const description = 'List all files in a specified directory';

let isOnScope;
let finalPath;

function listFunction(connectionInformation, path) {
      const currentDir = connectionInformation.currentDirectory;
      const rootDir = connectionInformation.rootDirectory;
      let result;

      isOnScopeFun();
      if (!isOnScope) {
            console.log("chemin inexistant pour le client");
            connectionInformation.connectionSocket.write("451 + msg\r\n");
            return;
      };

      if (!(fs.existsSync(finalPath) && fs.lstatSync(finalPath).isDirectory)) {
            console.log(`${finalPath} n'existe pas ou n'est pas un repertoire`);
            connectionInformation.connectionSocket.write("451 + msg\r\n")
      };
      // else

      fs.readdir(finalPath, (err, files) => {
            if (err) {
                  connectionInformation.connectionSocket.write('451 code erreur + \r\n');
                  return;
            }

            files.forEach(file => {
                  result = result + file + " / ";
            });
            result = result.slice(0, -1);
            // write une erreur
      });

      //verifier que le chemin est mtnt réel (notamment à cause des sous dossier)
      console.log("tout ok, result :\n"+ result );
      connectionInformation.connectionSocket.write('212 directory status\r\n');
      //maintenant on a besoin du dataSocket.

}


/*
 * 
 * Autre  methode --> directement extraire la diff entre current et root
 * Si y'a trop de ../.. alors current est vide 
 * retourner une erreur quand on veut fair .. sur un tabeau vide
 * Commme cela on est plus precis
 */

// return 
function isOnScopeFun(rootDir, currentDir, path) {
      let dir = currentDir.replace(rootDir, "");
      dir = dir.split("/");
      if (dir[0] == "") dir = dir.slice(1);
      let pathArr = path.split("/");  //faire un msg si "/" au debut de path --> error
      // console.log(`pathArr ${pathArr}`);

      for (str of pathArr) {
            if (str === "." || str === "..") {
                  if (dir.length == 0) {
                        // console.log("chemin non autorisé");
                        finalPath = null;
                        isOnScope = false;
                        return;
                  }
                  else {
                        dir.pop();
                  }
            }
            else {
                  dir.push(str);
            }
      }
      isOnScope = true;
      dir = "/" + dir.join("/");
      dir = rootDir + dir;
      finalPath = dir;
      // console.log(`finalPath ${finalPath}`);
};


// function isOnScope2(rootDir, currentDir, path) {
//       let finalArr = currentDir.split("/");
//       let pathArr = path.split("/");


//       for (str of pathArr) {
//             if (str == "." || str == "..") {
//                   finalArr.pop();
//             }
//             else {
//                   finalArr.push(str);
//             }
//       }

//       //maintenant on reforme finalArr et on regarde si il comprent rootDir
//       finalArr = finalArr.join("/"); //attention changement de type dynamique
//       console.log(finalArr);
//       if (finalArr.includes(rootDir)) return true;
//       else return false;
// };


isOnScopeFun("A/B/C", "A/B/C/D", "../C2")
isOnScopeFun("A/B/C", "A/B/C/D", "../../../../A");
isOnScopeFun("A/B/C", "A/B/C/D", "E/F/G");
isOnScopeFun("A/B/C", "A/B/C/D", "../../../../A/B/C/D");
isOnScopeFun("A/B/C", "A/B/C/D", "../../../../A/B/");