const colors = require('ansi-colors');

async function authenticate(connectionInformation) {
      const user = await connectionInformation.questionFunction(colors.bold.green("Enter your username:\n"));
      connectionInformation.client.write(`USER ${user}\r\n`);


      return new Promise((resolve) => {
            connectionInformation.client.once('data', async (data) => {
                  const response = data.toString();

                  if (response.startsWith('331')) {
                        const password = await connectionInformation.questionFunction(colors.bold.green("Enter your password:\n"));
                        connectionInformation.client.write(`PASS ${password}\r\n`);

                        connectionInformation.client.once('data', (data) => {
                              const response = data.toString();

                              if (response.startsWith('230')) {
                                    console.log(colors.bold.green('Authentication successful!\n\n'));
                                    resolve(); //user and password are good
                              } else {
                                    console.log(colors.bold.green('Invalid password, please try to connect again.\n'));
                                    authenticate(connectionInformation)
                                          .then(resolve);
                              }
                        });
                  } else {
                        console.log(colors.bold.green('Invalid username, please try again.\n'));
                        authenticate(connectionInformation)
                              .then(resolve);
                  }
            });
      });
}

module.exports = {
      authenticate,
};