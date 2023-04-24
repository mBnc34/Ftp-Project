var net = require('net');
var readline = require('readline');
const { stdin: input, stdout: output } = require('node:process');
const fs = require('fs'); // manage file & directory


const client = new net.Socket();
var terminal = readline.createInterface({ input, output });



terminal.question("Enter name or Ip of your ftp server ?\n", (answer) => {
try {
     // Connection of the client to the local server on his port 21 :
      client.connect(21, answer, function () {
      console.log('Connected to FTP server.');
      terminal.on('line', (input)=> {
            client.write(input + '\r\n');
      });
      client.on('data', (data) => {
            console.log(data.toString());
      })
    });
      
} catch (error) {
      console.log(error);
}


});