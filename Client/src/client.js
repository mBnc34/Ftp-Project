var net = require('net');

var readline = require('readline');
const { stdin: input, stdout: output } = require('node:process');


var terminal = readline.createInterface({ input, output });

/*en gros on doit avoir qu'un seul gros bloc
sinon faut avoir une nouvelle variable terminal --> pas beau
et le terminal.close() on le met dans le plus petit emboite,
*/
terminal.question("cela fonctionne-t-il ?\n", (answer) => {
      console.log(`la réponse est : ${answer}`);

      terminal.question("cela fonctionne-t-il 2 ?\n", (answer) => {
            console.log(`la réponse 2 est : ${answer}`);
            terminal.close();
      });
      // terminal.close(); // no -> because it's like asynchronous
});