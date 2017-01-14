const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Todo} = require('../models/todo');

/* beforeEach allows to run some code
 * before every single test case
 */
beforeEach((done) => {
  // remove all todos
  Todo.remove({}).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'play piano';

    request(app)
      .post('/todos')
      .send({
        text
      }).expect(200)
      .expect((result) => {
        expect(result.body.text).toBe(text);
      })
      .end((error, result) => {
        if(error){
          return done(error);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((error) => done(error));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((error, result) => {
        if(error){
          return done(error);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(0);
          done();
        }).catch((error) => done(error));
      });
  });
});