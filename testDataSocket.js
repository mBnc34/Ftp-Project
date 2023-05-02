const net = require('net');

class DataSocket {
  constructor() {
    this.server = net.createServer();
    this.mode = 'active';
    this.port = 20;

    this.server.on('connection', (socket) => {
      this.socket = socket;
    });

    this.server.on('close', () => {
      console.log('Data socket closed');
    });

    this.server.on('error', (err) => {
      console.log(`Data socket error: ${err.message}`);
    });
  }

  listen() {
    if (this.mode === 'active') {
      this.server.listen(this.port, () => {
        console.log(`Data socket listening on port ${this.port}`);
      });
    }
  }

  close() {
    this.server.close();
  }

  setMode(mode) {
    this.mode = mode;
  }

  setPort(port) {
    this.port = port;
  }

  send(data) {
    if (this.mode === 'active') {
      this.socket.write(data);
    }
  }

  startPassive() {
    this.server.listen(() => {
      this.port = this.server.address().port;
      console.log(`Data socket listening on port ${this.port}`);
    });
  }
}

module.exports = DataSocket;
