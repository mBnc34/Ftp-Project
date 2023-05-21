
async function pwdFunction(connectionInformation) {
      connectionInformation.client.write("PWD\r\n");
      const pwdResponse = await new Promise((resolve, reject) => {
            connectionInformation.client.on('data',(data)=> {
                  console.log(`dataPwd : \n${data}`);
                  resolve();
                  //extraire le  code et  la reeponse
                  // mettre la reponse dans connectionInformation
            })
      })
      
}

module.exports = {
      pwdFunction,
};
