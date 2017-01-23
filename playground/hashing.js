const bcrypt = require('bcryptjs');
// SHA-256
const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

// jwt.sign()
// jwt.verify()

// var data = {
//   id: 10
// };

// // send back to user when signup or login
// var token = jwt.sign(data, 'abc123!');

// console.log(token);

// try {
//   var decoded = jwt.verify(token , 'abc123!');
// } 
// catch(error) {
//   console.log(error);
// }

// console.log('decoded:', decoded);

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();

// console.log(`message: ${message}`);
// console.log(`hash: ${hash}`);

// var data = {
//   id: 4
// };

// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'salt').toString()
// }

// // man in the middle
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'salt').toString();

// if(resultHash === token.hash){
//   console.log('data was not changed');
// } else {
//   console.log('data was changed.  Don\'t trust');
// }

var password = '123abc!';
var hashedPassword = '$2a$14$hQMFMQJ.UWJB9mmftVYWW.msQz0FnNRlJ4g7xneBHKpOVWa8gALsS';

// bcrypt.genSalt(10, (error, salt) => {
//   bcrypt.hash(password, salt, (error, hash) => {
//     console.log(hash);
//   });
// });

bcrypt.compare(password, hashedPassword, (error, result) => {
  console.log('password matched?', result);
});