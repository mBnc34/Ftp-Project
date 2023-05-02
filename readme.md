# FTP-Project
The Project is to practice a little the FTP protocol using network Programming to see the particularities and understand better this protocol. We have to practice at low-level without FTP-library. We will use TCP library to works with TCP socket to create our server and client.

--> 2 parts in this Project.

The Server and the Client parts : [Server](Server/server.md)  / [Client](Client/client.md)

## Main Technologies Used 

| language | version | environment | TCP lib | OS
| :---: | :---: |:---: | :---: | :---: |
| JavaScript | commonJS | nodeJS | 'net' | windows |

## Some difficulties :
- Manage 2 sockets :    
  - Comand's socket to manage the first connexion and the commands
  - Data's socket when data need to be send (data that is not just message and code)
- Manage the 2 connection mode :
  - Active mode : 
  - Passive mode : To let the client decide his own port for data socket 