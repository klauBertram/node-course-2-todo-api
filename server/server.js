const express = require('express');
const bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
 
var app = express();

// middlewar
app.use(bodyParser.json());

// create - POST method
app.post('/todos', (request, response) => {
  console.log(request.body);

  var todo = Todo({
    text: request.body.text
  });

  todo.save().then((result) => {
    response.status(200).send(result);
  }, (error) => {
    response.status(400).send(error);
  });
});

// read - GET method
// /todos/[id]

app.listen(3000, () => {
  console.log('started on port 3000');
});

module.exports = {
  app
};


// create Todo model
// return constructor function


// add one todo
// var newTodo = new Todo({
//   text: 'cook dinner'
// });

// save to db
// newTodo.save().then((result) => {
//   console.log('saved todo');
//   console.log(result);
// }, (error) => {
//   console.log('error', error);
// });

// var newTodo = new Todo({
//   text: 'cook midnight supper',
//   completed: false,
//   completedAt: +new Date() // return current timestamp, unary operator + triggers valueOf method of Date object
// });

/* mongoose will do type, 123 will be type cast to string, 
 * boolean true 
 * will be type cast as string as well
 */
// var newTodo = new Todo({
//   text: '   Edit this video    '
// });

// newTodo.save().then((result) => {
//   console.log(JSON.stringify(result, undefined, 2));
// }, (error) => {
//   console.log('unable to save', error);
// });

// // user model
// // email, required, trim, type string, min length of 1


// var newUser = new User({
//   email: '   tony@si.com   '
// });

// newUser.save().then((result) => {
//   console.log(JSON.stringify(result, undefined, 2));
// }, (error) => {
//   console.log('unable to save', error);
// });

