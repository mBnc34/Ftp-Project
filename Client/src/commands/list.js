const fs = require('fs');

async function listFunction(connectionInformation) {
      const rootDir = connectionInformation.rootDirectory;


      connectionInformation.dataSocketPromise.then(() => {
            connectionInformation.client.write("LIST");
            try {
                  connectionInformation.dataSocket.on('data', (data) => {
                        console.log(`${data}\n`);
                        // connectionInformation.dataSocket.write(data);
                        // console.log(`Received ${data.length} bytes of data.`);
                        // console.log(`stor received data \n${data}`);
                  });
            } catch (error) {
                  console.log(error);
                  return;
                  // connectionInformation.connectionSocket.write("425 Can't open data connection.\r\n");
            }
      })

}

module.exports = {
      listFunction,
};