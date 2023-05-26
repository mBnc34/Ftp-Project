const net = require('net');
const readline = require('readline');
const { authenticate } = require('./auth')
const { handleClientCommand } = require('./data')
const os = require('os');

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




async function Main() {
  let client;
  let notConnected = true;
  var connectionInformation = {
    client: null,
    rootDirectory: "Client/RootDirectory",
    pwd: "",
    questionFunction: question,
    dataSocket: null,
    portServer: null,
    dataSocketPromise: undefined,
    dataCommand: null,
    connectionMode: "PASV"
  };

  const networkInterfaces = os.networkInterfaces();
  const addresses = [];
  let localAddress;

  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];

    for (const iface of interfaces) {
      // if (iface.family === 'IPv4' && !iface.internal && iface.netmask === '255.255.224.0') {
      if (iface.family === 'IPv4' && !iface.internal && iface.netmask === '255.255.255.0') {
        addresses.push(iface.address);
      }
    }
  }

  localAddress = addresses[0];
  // console.log(localAddress);

  while (notConnected) {
    const serverName = await question("Enter name or IP of your FTP server:\n");
    const serverPort = await question("Enter Port of your FTP server:\n");
    try {
      connectionInformation.client = new net.Socket();
      connectionInformation.client = net.createConnection({ port: serverPort, host: serverName, localAddress: localAddress, family: 4}, () => {
        console.log('Connected to FTP server.');
      });
      // socket.localAddress = localAddress;

      connectionInformation.client.on('error', (error) => {
        if (error.toString().includes("ENOTFOUND")) {
          console.log('Server not found, please try again.');
          Main();
        }
        // console.log('client error:', error);
        else if (error.toString().includes("write ECONNABORTED")) {
          console.log("error on client, reconnect please\n");
        }
        // console.log('Error code:', error.code);
        // console.log('Error message:', error.message);
        // console.log('Stack trace:', error.stack);

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
      Main();
    }
  }
}

Main();
