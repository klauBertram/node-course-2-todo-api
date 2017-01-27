require('./config/config');

const bcrypt = require('bcryptjs');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

const { authenticate } = require('./middleware/authenticate');
const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
 
var app = express();

// heroku settings
const port = process.env.PORT;

// middlewar
app.use(bodyParser.json());

// create - POST method
app.post('/todos', (request, response) => {
  var todo = new Todo({
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

    response.send({ todo });
  }).catch((error) => {
    response.status(400).send();
  });

  // response.send(request.params);
});

app.delete('/todos/:id', (request, response) => {
  // get the id
  var id = request.params.id;

  // validate id -> not valid? return 404
  if(!ObjectID.isValid(id)){
    return response.status(404).send();
  }

  // remove todo by id
  // success, if no doc send 404, if doc send doc w/ 200
  Todo.findByIdAndRemove(id).then((todo) => {
    // id not found
    if(!todo){
      return response.status(404).send();
    }

    response.status(200).send({ todo });
  }).catch((error) => {
    response.status(400).send();
  });
  // error, send 400 with {}
});

app.patch('/todos/:id', (request, response) => {
  var id = request.params.id;
  var body = _.pick(request.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)){
    response.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime(); // return js timestamp
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {
    $set: body
  }, {
    new: true
  }).then((todo) => {
    if(!todo){
      return response.status(404).send();
    }

    response.status(200).send({ todo });
  }).catch((error) => {
    response.status(400).send();
  });
});

// POST /users
// use pick method from _
app.post('/users', (request, response) => {
  var body = _.pick(request.body, ['email', 'password']);
  // equivalent to
  // var user = new User({
  //   email: body.email,
  //   password: body.password,
  //   tokens: body.tokens
  // });
  var user = new User(body);

  // model methods
  // e.g. User.someMethod();
  // User.findByToken
  // instance methods
  // e.g. user.someMethod();

  // user.save().then((user) => {
  user.save().then(() => {
    // response.status(200).send(result);
    return user.generateAuthToken();
  }).then((token) => {
    response.header('x-auth', token).status(200).send(user);
  }).catch((error) => {
    response.status(400).send(error);
  });
});



app.get('/users/me', authenticate, (request, response) => {
  response.send(request.user);
});

app.listen(port, () => {
  console.log(`started on port ${port}`);
});

module.exports = {
  app
};

// POST /users/login {email, password}
app.post('/users/login', (request, response) => {
  var body = _.pick(request.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    // create new token and response http request
    user.generateAuthToken().then((token) => {
      response.header('x-auth', token).status(200).send(user);
    });
  }).catch((error) => {
    response.status(401).send({});
  });
});

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

