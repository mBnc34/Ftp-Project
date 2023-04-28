// const { server } = require('./server');

function handleUserCommand(socket, data) {

    // console.log(data.toString());
    const dataSplit= data.toString().split(" ");
    const command = dataSplit[0];

    if (command === "OPTS"){
      console.log("encoding " + dataSplit[1] + " " + dataSplit[2] );
      socket.write('Server Ready!\r\n'); // pour debloquer le client
    }
    else if (command === 'USER') {
      // Handle USER command
      socket.write('331 Please specify the password.\r\n');
    } else if (command === 'PASS') {
      // Handle PASS command
      socket.write('230 Login successful.\r\n');
    } else {
      socket.write('500 Invalid command.\r\n');
    }

}

module.exports = {
  handleUserCommand,
};
