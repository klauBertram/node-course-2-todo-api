const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// var id = '587ab796dc64796f1666610e11';

// if(!ObjectID.isValid(id)){
//   return console.log('id not valid');
// }

// query by anything
// mongoose will convert id to an ObjectID for mongodb
// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });

// return obj instead of array and null if not found vs empty array
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//   if(!todo){
//     return console.log('id not found');
//   }
//   console.log('Todo by id', todo);
// }).catch((error) => {
//   console.log(error);
// });

var userId = '5879bc4434fdfb5c0a5ab150';

// user find by id
// handle user not found
// handle user found
// handle any errors
User.findById(userId).then((user) => {
  if(!user){
    return console.log('user not found');
  }

  console.log(JSON.stringify(user, undefined, 2));
}).catch((error) => {
  console.log(error);
});