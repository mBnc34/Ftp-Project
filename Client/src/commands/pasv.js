const net = require('net');

function pasvFunction(connectionInformation) {
      connectionInformation.dataSocketPromise = new Promise((resolve, reject) => {
            connectionInformation.client.write("PASV");
            connectionInformation.client.once('data', (data) => {
                  //if else avec command
                  // console.log(`data pasv: ${data}`);
                  const dataArr = data.toString().split(' ');
                  const command =  dataArr[0];
                  const information =  dataArr[1].replace(/[().]/g, '').split(',');
            
                  const addr = information.slice(0, 4).join('.');
                  const clientPort = parseInt(information[4]) * 256 + parseInt(information[5]);
                  // console.log(`addr:port ${addr}:${clientPort}`);


                  connectionInformation.dataSocket = net.createConnection({ port: clientPort, host: addr }, () => {
                        // console.log('Socket de données (via PORT) créé avec succès');
                        // console.log(`addr:port ${connectionInformation.dataSocket.remotePort}`);
                  });

                  connectionInformation.dataSocket.on('connect', () => {
                        // console.log(`test addr:port ${connectionInformation.dataSocket.remotePort}`);
                        // connectionInformation.connectionSocket.write('200 Command okay\r\n');
                        resolve();
                  });

                  connectionInformation.dataSocket.on('close', () => {
                        // console.log(`Data Connection closed with ${addr}:${clientPort}`);
                        connectionInformation.dataSocketPromise = undefined;
                        connectionInformation.dataSocket = null;
                  });
            })
      })
}


module.exports = {
      pasvFunction,
};