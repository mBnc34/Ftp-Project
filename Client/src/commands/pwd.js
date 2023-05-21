
async function pwdFunction(connectionInformation) {
      connectionInformation.client.write("PWD\r\n");

            connectionInformation.client.once('data',(data)=> {
                  // console.log(`dataPwd : \n${data}`);
                  console.log(`${data}`);
                  // resolve();
                  //extraire le  code et  la reeponse
                  // mettre la reponse dans connectionInformation
            })
      
}

module.exports = {
      pwdFunction,
};
