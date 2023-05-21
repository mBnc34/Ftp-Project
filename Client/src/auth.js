async function authenticate(connectionInformation) {
      const user = await connectionInformation.questionFunction("Enter your username:\n");
      connectionInformation.client.write(`USER ${user}\r\n`);
      

      return new Promise((resolve) => {
            connectionInformation.client.once('data', async (data) => {
                  console.log(`Data received from server: ${data}`);

                  const response = data.toString();

                  if (response.startsWith('331')) {
                        const password = await connectionInformation.questionFunction("Enter your password:\n");
                        connectionInformation.client.write(`PASS ${password}\r\n`);

                        connectionInformation.client.once('data', (data) => {
                              console.log(`Data received from server: ${data}`);

                              const response = data.toString();

                              if (response.startsWith('230')) {
                                    console.log('Authentication successful!');
                                    resolve();
                              } else {
                                    console.log('Invalid password, please try again.');
                                    authenticate(connectionInformation)
                                          .then(resolve);
                              }
                        });
                  } else {
                        console.log('Invalid username, please try again.');
                        authenticate(connectionInformation)
                              .then(resolve);
                  }
            });
      });
}

module.exports = {
      authenticate,
};