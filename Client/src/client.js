const net = require('net');
const readline = require('readline');
const { authenticate } = require('./auth')
const { handleClientCommand } = require('./data')
const os = require('os');
const colors = require('ansi-colors');

function question(message) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false //  that avoid a problem of 2 same line seen
    });

    process.stdout.write(message);
    rl.on('line', (answer) => {
      rl.close();
      resolve(answer);
    });

    rl.on('SIGINT', () => {
      rl.clearLine();
      rl.close();
    });
  });
};




async function Main() {
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

  // a section to extract ip of the computer and use the specific from the school network (because the only that use subnet mask 255.255.224.0)
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


  while (notConnected) {
    const serverName = await question(colors.bold.green("Enter name or IP of your FTP server:\n"));
    const serverPort = await question(colors.bold.green("Enter Port of your FTP server:\n"));
    try {
      // connectionInformation.client = new net.Socket();
      connectionInformation.client = net.createConnection({ port: serverPort, host: serverName, localAddress: localAddress, family: 4 }, () => {
        console.log(colors.bold.green('Connected to FTP server.\n'));
      });

      // to don't crash in case of errors with some errors that i met
      connectionInformation.client.on('error', (error) => {
        if (error.toString().includes("ENOTFOUND")) {
          console.log(colors.bold.green('Server not found, please try again.\n'));
          Main();
        }
        else if (error.toString().includes("write ECONNABORTED")) {
          console.log(colors.bold.green("error on client, reconnect please\n"));
        }
      });

      await new Promise((resolve) => {
        connectionInformation.client.once('data', async (data) => {
          const response = data.toString();

          // if we are now "interconnected" --> authentication
          if (response.startsWith('220')) {
            await authenticate(connectionInformation);
            // when the authentication is resolve --> we can start the client program :
            handleClientCommand(connectionInformation);
          } else {
            console.log(colors.bold.green('Unexpected response from server:', response, "\n"));
          }

          resolve();
          notConnected = false;
        });
      });
    } catch (error) {
      console.log(colors.bold.green('Error connecting to server:', error.message));
      Main();
    }
  }
}

Main();
