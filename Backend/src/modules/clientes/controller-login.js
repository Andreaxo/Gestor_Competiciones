const controller = require('./controller');
async function findByEmail(email){
      try{
          const user = await controller.findByEmail(email);
          return user;
      } catch(error){
          throw error;
      }
  }
  exports.findByEmail = findByEmail