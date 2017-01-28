const bcrypt = require('bcryptjs');
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

UserSchema.methods.removeToken = function(token){
  var user = this;

  return user.update({
    $pull: {
      tokens: {
        token
      }
    }
  })
}

// statics turns into a model method
UserSchema.statics.findByCredentials = function(email, password){
  var User = this;

  return User.findOne({email}).then((user) => {
    if(!user){
      return Promise.reject();
    }
    
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (error, result) => {
        if(result){
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.statics.findByToken = function(token){
  var User = this;
  var decoded;

  try{
    decoded = jwt.verify(token, 'abc123');
    // console.log('decoded:', decoded);
  } catch(error){
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    // return Promise.reject('some value from failed token in user model');
    return Promise.reject();
  }

  // return a promise
  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

// mongoose middleware
UserSchema.pre('save', function(next){
  var user = this;

  if(user.isModified('password')) {
    // hash pw
    // user.password = hash
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(user.password, salt, (error, hash) => {
        user.password = hash;
        /* reason why we have to call next() in 2 different location
         * from Udemy Q&A section
         * Calling next tells Mongoose that you're all done with the middleware. Mongoose is going to save the changes and move on. The first example sets the password then calls next. Mongoose saves the change. The second example starts the process, but next gets called before the bcrypt callback functions have a chance to set the password. The change is not recorded because Mongoose has already saved the user and moved on.
         */
        next();
      });
    });
  } else {
    next();
  }
});

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