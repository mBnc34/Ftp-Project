const net = require('net');
const readline = require('readline');
const { authenticate } = require('./auth')
const { handleClientCommand } = require('./data')

function question(message) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false // Désactiver le mode terminal pour éviter les lignes en double
    });

    process.stdout.write(message); // Afficher le message sans sauter de ligne

    rl.on('line', (answer) => {
      rl.close();
      resolve(answer);
    });

    // Effacer la ligne actuelle lorsque l'utilisateur appuie sur Entrée
    rl.on('SIGINT', () => {
      rl.clearLine();
      rl.close();
    });
  });
};

var connectionInformation = {
  client: null,
  rootDirectory: "Client/RootDirectory",
  questionFunction: question,
  dataSocket: null,
  dataSocketPromise: undefined,
  dataCommand: null,
  connectionMode: "passive"
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
          //     console.error(`Error connecting to server: ${error.message}`);
          reject(error);
        });
      });

      break; // end while
    } catch (error) {
      console.log('Server not found, please try again.');
    }
  }

  client.once('data', async (data) => {
    //     console.log(`Data received from server: ${data}`);

    const response = data.toString();

    if (response.startsWith('220')) {
      console.log(response);
      await authenticate(connectionInformation).then(() => {
        handleClientCommand(connectionInformation)
      })
    } else {
      // Main();
    }
  });


}

Main();
