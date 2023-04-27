// const { server } = require('./server');

function handleUserCommand(socket) {


  socket.on('data', (data) => {
    console.log(data.toString());
    const command = data.toString().trim();

    if (command === 'USER') {
      // Handle USER command
      socket.write('331 Please specify the password.\r\n');
    } else if (command === 'PASS') {
      // Handle PASS command
      socket.write('230 Login successful.\r\n');
    } else {
      socket.write('500 Invalid command.\r\n');
    }
  });
}

module.exports = {
  handleUserCommand,
};
