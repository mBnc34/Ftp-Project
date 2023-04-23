const net = require('net');

const server = net.createServer(function (socket) {
  socket.write('220 FTP server ready.\r\n');

  const clientAddress = socket.remoteAddress;
  const clientPort = socket.remotePort;
  console.log(`client connected with address ${clientAddress} using port ${clientPort}`);


  socket.on('data', function (data) {
    const command = data.toString().trim();
    console.log('Received command:', command);
      console.log("tets");
    if (command === 'USER username') {
      socket.write('331 Password required for username.\r\n');
    } else if (command === 'PASS password') {
      socket.write('230 User logged in.\r\n');
    } else if (command === 'QUIT') {
      socket.write('221 Goodbye.\r\n');
      socket.end();
    } else {
      socket.write('500 Syntax error, command unrecognized.\r\n');
    }
  });
});

server.listen(21, function () {
  console.log('FTP server listening on port 21');
});
