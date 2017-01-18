const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// remove all
// return only how many got removed
// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// also return document when removed
Todo.findOneAndRemove({_id: '587da024681dbf87a0a97139'}).then((todo) => {
  console.log(todo);
});

// also return doc
Todo.findByIdAndRemove('587da024681dbf87a0a97139').then((todo) => {
  console.log(todo);
});