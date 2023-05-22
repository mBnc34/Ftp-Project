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
  connectionMode: "PASV"
}

async function Main() {
  let client;
  let notConnected = true;


  while (notConnected) {
    const serverName = await question("Enter name or IP of your FTP server:\n");
    // client = new net.Socket();

    try {
      connectionInformation.client = net.createConnection(21, serverName, () => {
        console.log('Connected to FTP server.');
      });
    
      connectionInformation.client.on('error', (error) => {
        console.log('Server not found, please try again.');
      });
    
      await new Promise((resolve) => {
        connectionInformation.client.once('data', async (data) => {
          const response = data.toString();
    
          if (response.startsWith('220')) {
            // console.log(response);
            await authenticate(connectionInformation);
            handleClientCommand(connectionInformation);
          } else {
            console.log('Unexpected response from server:', response);
          }
    
          resolve();
          notConnected = false;
        });
      });
    } catch (error) {
      console.log('Error connecting to server:', error.message);
    }
    

  }
}

Main();
