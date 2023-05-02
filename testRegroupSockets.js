const ConnectionSocket = require('./connectionSocket');
const DataSocket = require('./dataSocket');

const connectionSocket = new ConnectionSocket();
const dataSocket = new DataSocket();

connectionSocket.setDataSocket(dataSocket);

connectionSocket.listen(21);
dataSocket.listen();
