var { User } = require('../models/user');

const authenticate = (request, response, next) => {
  var token = request.header('x-auth');

  User.findByToken(token).then((user) => {
    if(!user){
      return Promise.reject();
    }

    request.user = user;
    request.token = token;
    next();
  }).catch((error) => {
    console.log('middleware authenticate failed', error);
    response.status(401).send();
  });
};

module.exports = {
  authenticate
}