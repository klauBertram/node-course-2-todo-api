const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const {populateTodos, populateUsers, todos, users} = require('./seed/seed');

/* beforeEach allows to run some code
 * before every single test case
 */
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'play piano';

    request(app)
      .post('/todos')
      .set({
        'x-auth': users[0].tokens[0].token
      })
      .send({
        text
      }).expect(200)
      .expect((result) => {
        expect(result.body.todo.text).toBe(text);
      })
      .end((error, result) => {
        if(error){
          return done(error);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((error) => done(error));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .set({
        'x-auth': users[0].tokens[0].token
      })
      .send({})
      .expect(400)
      .end((error, result) => {
        if(error){
          return done(error);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((error) => done(error));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set({
        'x-auth': users[0].tokens[0].token
      })
      .expect(200)
      .expect((response) => {
        // console.log('--- all todos ---');
        // console.log(response);
        // console.log('--- end all todos ---');
        expect(response.body.todos.length).toBe(1);
      })
      .end(done);
  }); 
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set({
        'x-auth': users[0].tokens[0].token
      })
      .expect(200)
      .expect((response) => {
        // console.log(JSON.stringify(response, undefined, 2));
        // console.log(todos[0].text);
        expect(response.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should not return todo doc created by other user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set({
        'x-auth': users[0].tokens[0].token
      })
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    // make sure you get a 404 back
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .set({
        'x-auth': users[0].tokens[0].token
      })
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    // /todos/123 
    request(app)
      .get(`/todos/123`)
      .set({
        'x-auth': users[0].tokens[0].token
      })
      .expect(404)
      .end((done));
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    // grab id of 1st item
    // update text, set completed true
    // 200
    // custom assert
    //   text is change
    //   completed true
    //   copmletedAt toBeA
    var hexId = todos[0]._id.toHexString();
    var text = "edited first test todo";

    request(app)
      .patch(`/todos/${hexId}`)
      .set({
        'x-auth': users[0].tokens[0].token
      })
      .send({
        text,
        completed: true
      })
      .expect(200)
      .expect((response) => {
        expect(response.body.todo.text).toBe(text);
        expect(response.body.todo.completed).toBe(true);
        expect(response.body.todo.completedAt).toBeA('number');
      })
      .end(done);
      // .end((error, result) => {
      //   if(error){
      //     return done(error);
      //   }

      //   Todo.findById(hexId).then((todo) => {
      //     expect(todo.text).toBe(text);
      //     expect(todo.completed).toBe(true);
      //     expect(todo.completedAt).toBeA('number');
      //     done();
      //   }).catch((error) => done(error));
      // });
  });

  it('should not update the todo by another user', (done) => {
    var hexId = todos[1]._id.toHexString();
    var text = "edited first test todo";

    request(app)
      .patch(`/todos/${hexId}`)
      .set({
        'x-auth': users[0].tokens[0].token
      })
      .send({
        text,
        completed: true
      })
      .expect(404)
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    // grab id of 2nd item
    // update text, set completed false
    // 200
    // custom assert
    //   text is change
    //   completed false
    //   complatedAt null toNotExist
    var hexId = todos[1]._id.toHexString();
    var text = 'edited Second test todo';

    request(app)
      .patch(`/todos/${hexId}`)
      .set({
        'x-auth': users[1].tokens[0].token
      })
      .send({
        text,
        completed: false
      })
      .expect(200)
      .expect((response) => {
        expect(response.body.todo.text).toBe(text);
        expect(response.body.todo.completed).toBe(false);
        expect(response.body.todo.completedAt).toNotExist();
      })
      .end(done);
      // .end((error, result) => {
      //   if(error){
      //     return done(error);
      //   }

      //   Todo.findById(hexId).then((todo) => {
      //     expect(todo.text).toBe(text);
      //     expect(todo.completed).toBe(false);
      //     expect(todo.completedAt).toNotExist();
      //     done();
      //   }).catch((error) => done(error));
      // });
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set({
        'x-auth': users[1].tokens[0].token
      })
      .expect(200)
      .expect((response) => {
        expect(response.body.todo._id).toBe(hexId);
      })
      .end((error, response) => {
        if(error){
          return done(error);
        }

        // query db using findById, use toNotExist
        // expect(null).toNotExist();
        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((error) => done(error));
      });
  });

  it('should not remove a todo by another user', (done) => {
    var hexId = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set({
        'x-auth': users[1].tokens[0].token
      })
      .expect(404)
      .end((error, response) => {
        if(error){
          return done(error);
        }

        // query db using findById, use toNotExist
        // expect(null).toNotExist();
        Todo.findById(hexId).then((todo) => {
          expect(todo).toExist();
          done();
        }).catch((error) => done(error));
      });
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .set({
        'x-auth': users[1].tokens[0].token
      })
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/todos/123')
      .set({
        'x-auth': users[1].tokens[0].token
      })
      .expect(404)
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((response) => {
        expect(response.body.user._id).toBe(users[0]._id.toHexString());
        expect(response.body.user.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    // expect 401 back
    // expect body is {} toEqual to assert for empty object
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((response) => {
        expect(response.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'steve@avengers.com';
    var password = 'abc123';

    request(app)
      .post('/users')
      .send({
        email,
        password
      })
      .expect(200)
      .expect((response) => {
        // console.log(response);
        expect(response.headers['x-auth']).toExist();
        expect(response.body.user._id).toExist();
        expect(response.body.user.email).toBe(email);
      })
      .end((error) => {
        // query db to make sure it is there
        if(error){
          return done(error);
        }

        User.findOne({email}).then((user) => {
          // console.log('found user', user);
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((error) => done(error));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    // use invalid email and password
    // expect 400
    var email = 'invalidEmail';
    var password = '123';

    request(app)
      .post('/users')
      .send({
        email,
        password
      })
      .expect(400)
      .end(done);
  });

  it('should not create if email in use', (done) => {
    // existing email
    // expect 400
    var email = users[0].email;
    var password = '123456'

    request(app)
      .post('/users')
      .send({
        email,
        password
      })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((response) => {
        expect(response.headers['x-auth']).toExist();
      })
      .end((error, response) => {
        if(error){
          return done(error);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: response.headers['x-auth']
          });

          done();
        }).catch((error) => done(error));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: 'wrongPassword'
      })
      .expect(401)
      .expect((response) => {
        expect(response.headers['x-auth']).toNotExist();
      })
      .end((error, response) => {
        if(error){
          return done(error);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);

          done();
        }).catch((error) => done(error));
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    // make delete request
    // set x-auth equal to token
    // expect 200
    // find user, verify that tokens array has length of 0
    request(app)
      .delete('/users/me/token')
      .set({
        'x-auth': users[0].tokens[0].token
      })
      .expect(200)
      .expect((response) => {
        expect(response.headers['x-auth']).toNotExist();
      })
      .end((error, response) => {
        if(error){
          return done(error);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);

          done();
        }).catch((error) => done(error));
      });
  });
})