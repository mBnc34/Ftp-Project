var net = require('net');
// https://github.com/bobchennan/FTP
var readline = require('readline');
const { stdin: input, stdout: output } = require('node:process');
const fs = require('fs'); // manage file & directory


const client = new net.Socket();
var terminal = readline.createInterface({ input, output });

terminal.question("Enter name or Ip of your ftp server ?\n", (answer) => {
try {
     // Connection of the client to the local server on his port 21 :
      client.connect(21, answer, function () {
      terminal.pause();
      console.log('Connected to FTP server.');
      terminal.resume();
      // console.log(client.remoteAddress());
      // client.write('USER username\r\n');
      // client.write('PASS password\r\n');
      // client.write('QUIT\r\n');
    });
      
} catch (error) {
      console.log(error);
}

// Connection of the client to the local server on his port 21 :
// client.connect(21, '127.0.0.1', function () {
//       console.log('Connected to FTP server.');
//       // console.log(client.remoteAddress());
//       // client.write('USER username\r\n');
//       // client.write('PASS password\r\n');
//       // client.write('QUIT\r\n');
//     });


/*en gros on doit avoir qu'un seul gros bloc
sinon faut avoir une nouvelle variable terminal --> pas beau
et le terminal.close() on le met dans le plus petit emboite,
*/

      // console.log(`la réponse est : ${answer}`);

      terminal.question("cela fonctionne-t-il 2 ?\n", (answer) => {
            console.log(`la réponse 2 est : ${answer}`);
            terminal.close();
      });
      // terminal.close(); // no -> because it's like asynchronous
});