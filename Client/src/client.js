const net = require('net');
const readline = require('readline');
const {authenticate} = require('./auth')
const {handleClientCommand} = require('./data')

function question(message) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(message, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

var connectionInformation = {
      client: null,
      questionFunction: question,
}

async function Main() {
  let client;

  while (true) {
    const serverName = await question("Enter name or IP of your FTP server:\n");
    client = new net.Socket();

    try {
      await new Promise((resolve, reject) => {
        connectionInformation.client = client.connect(21, serverName, () => {
          console.log('Connected to FTP server.');
          resolve();
        });

        client.on('error', (error) => {
          console.error(`Error connecting to server: ${error.message}`);
          reject(error);
        });
      });

      break; // end while
    } catch (error) {
      console.log('Server not found, please try again.');
    }
  }

  client.once('data', async (data) => {
    console.log(`Data received from server: ${data}`);

    const response = data.toString();

    if (response.startsWith('220')) {
      console.log(response);
      await authenticate(connectionInformation).then(()=> {
            handleClientCommand(connectionInformation)
      })
    } else {
      
    }
  });


}

Main();
