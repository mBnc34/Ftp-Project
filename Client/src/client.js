var net = require('net');
var readline = require('readline');

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
}

async function authenticate(client) {
  const user = await question("Enter your username:\n");
  client.write(`USER ${user}\r\n`);

  return new Promise((resolve) => {
    client.once('data', async (data) => {
      console.log(`Data received from server: ${data}`);

      const response = data.toString();

      if (response.startsWith('331')) {
        const password = await question("Enter your password:\n");
        client.write(`PASS ${password}\r\n`);

        client.once('data', (data) => {
          console.log(`Data received from server: ${data}`);

          const response = data.toString();

          if (response.startsWith('230')) {
            console.log('Authentication successful!');
            resolve();
          } else {
            console.log('Invalid password, please try again.');
            authenticate(client)
              .then(resolve);
          }
        });
      } else {
        console.log('Invalid username, please try again.');
        authenticate(client)
          .then(resolve);
      }
    });
  });
}

async function Main() {
  const serverName = await question("Enter name or IP of your FTP server:\n");
  const client = net.createConnection(21, serverName);

  client.once('data', async (data) => {
    console.log(`Data received from server: ${data}`);

    const response = data.toString();

    if (response.startsWith('220')) {
      console.log(response);
      await authenticate(client);
    } else {
      // Vous êtes déjà authentifié, vous pouvez traiter les autres réponses du serveur ici
    }
  });

  // Le reste de votre code...

}

Main();
