const jwt = require('jsonwebtoken');
const _ = require('lodash');
const mongoose = require('mongoose');
const validator = require('validator');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      /* equivalent to
       * validator: (value) => {
       *   return validator.isEmail(value);
       * }
       */
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

/* override mongoose method */
UserSchema.methods.toJSON = function(){
  var user = this;
  // converting from mongoose object to regular object
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

/* need to use old function instead of arrow function
 * b/c arrow function does not bind with 'this' keyword
 */
UserSchema.methods.generateAuthToken = function(){
  var user = this;
  var access = 'auth';
  var token = jwt.sign({
    _id: user._id.toHexString(),
    access
  }, 'abc123').toString();

  user.tokens.push({
    access,
    token
  });

  // returns a promise
  return user.save().then((user) => {
    return token;
  });
};

// statics turns into a model method
UserSchema.statics.findByToken = function(token){
  var User = this;
  var decoded;

  try{
    decoded = jwt.verify(token, 'abc123');
    console.log('decoded:', decoded);
  } catch(error){
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject('some value from failed token in user model');
  }

  // return a promise
  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
}

var User = mongoose.model('User', UserSchema);

// cannot add custom methods to model, need to use schema
// var User = mongoose.model('User', {
//   email: {
//     type: String,
//     required: true,
//     trim: true,
//     minlength: 1,
//     unique: true,
//     validate: {
//       /* equivalent to
//        * validator: (value) => {
//        *   return validator.isEmail(value);
//        * }
//        */
//       validator: validator.isEmail,
//       message: '{VALUE} is not a valid email'
//     }
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6
//   },
//   tokens: [{
//     access: {
//       type: String,
//       required: true
//     },
//     token: {
//       type: String,
//       required: true
//     }
//   }]
// });

module.exports = {
  User
};