const net = require('net');

class ConnectionSocket {
  constructor() {
    this.server = net.createServer();
    this.dataSocket = null;

    this.server.on('connection', (socket) => {
      console.log('Client connected');
      socket.write('220 FTP server ready\r\n');

      socket.on('data', (data) => {
        const command = data.toString().trim();

        console.log(`Received command: ${command}`);

        if (command === 'QUIT') {
          socket.write('221 Goodbye.\r\n');
          socket.end();
          this.dataSocket.close();
          this.server.close();
          console.log('Client disconnected');
        } else if (command === 'PASV') {
          socket.write('227 Entering Passive Mode (127,0,0,1,0,0)\r\n');
          this.dataSocket.setMode('passive');
          this.dataSocket.startPassive();
        } else {
          socket.write('500 Command not implemented.\r\n');
        }
      });

      socket.on('error', (err) => {
        console.log(`Connection socket error: ${err.message}`);
      });
    });

    this.server.on('close', () => {
      console.log('Connection socket closed');
    });

    this.server.on('error', (err) => {
      console.log(`Connection socket error: ${err.message}`);
    });
  }

  listen(port) {
    this.server.listen(port, () => {
      console.log(`Connection socket listening on port ${port}`);
    });
  }

  setDataSocket(dataSocket) {
    this.dataSocket = dataSocket;
  }

  close() {
    this.server.close();
  }
}

module.exports = ConnectionSocket;
