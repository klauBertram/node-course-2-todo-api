const {ObjectID} = require('mongodb');
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
app.get('/todos', (request, response) => {
  Todo.find().then((todos) => {
    // send obj will make this scalable
    response.status(200).send({ todos });
  }, (error) => {
    response.status(400).send(error);
  });
});


// GET /todos/12345 
app.get('/todos/:id', (request, response) => {
  var id = request.params.id;

  // validate id using isValid
  // response 404, if id is invalid, send back empty body

  // findById
  // success
  // send it back, if no todo, send back w/ 404
  // error
  // send 400 and send empty body back
  if(!ObjectID.isValid(id)){
    return response.status(404).send();
  }

  // why catch method is preferred
  /* The only difference is that the first solution will have the catch method fired if
   * code inside the success case throws and error. This is because the catch call is 
   * chained after the then call.
   *
   * The second solution is a little different. It has a success/error handler for the 
   * findById method, but there is no error handler for the success case.
   */
  Todo.findById(id).then((todo) => {
    if(!todo) {
      return response.status(404).send();
    }

    response.send({ todo })
  }).catch((error) => {
    response.status(400).send();
  });

  // response.send(request.params);
});

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

