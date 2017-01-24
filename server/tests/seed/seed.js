const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

const userOneId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'tony@si.com',
  password: '123456',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: new ObjectID(),
  email: 'pepper@si.com',
  password: 'abcdef'
}];

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: new Date().getTime()
}];

const populateTodos = (done) => {
  // remove all todos
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    /*Promise.all will wait until all the promises are done 
     * until it fires
     */ 
    return Promise.all([userOne, userTwo])
  }).then(() => done());
}

module.exports = {
  populateTodos,
  populateUsers,
  todos,
  users
};