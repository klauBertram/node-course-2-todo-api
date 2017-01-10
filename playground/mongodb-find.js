// const MongoClient = require('mongodb').MongoClient;
// identical above
// const { MongoClient } = require('mongodb');
const { MongoClient, ObjectID } = require('mongodb');

/* es6 feature - obj destructuring, 
 * allows you to grab an obj property and 
 * set it to a var
 */
// example
// var user = { name: 'kenn', age: 25 }
// var {name} = user;
// console.log(name);

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
  if(error){
    return console.log('unable to connect to MongoDB server', error);
  }

  console.log('connected to MongoDB server');

  // find() returns a cursor
  // toArray() returns a promise
  // db.collection('Todos').find().toArray().then((docs) => {
  //   console.log('--- Todos ---');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (error) => {
  //   console.log('unable to fetch todos', error);
  // });

  // db.collection('Todos').find({ completed: false }).toArray().then((docs) => {
  //   console.log('--- Todos ---');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (error) => {
  //   console.log('unable to fetch todos', error);
  // });

  // db.collection('Todos').find({ 
  //   _id: new ObjectID("5872d4d3fc55d7a5d5bba3cc") 
  // }).toArray().then((docs) => {
  //   console.log('--- Todos ---');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (error) => {
  //   console.log('unable to fetch todos', error);
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`);
  // }, (error) => {
  //   console.log('unable to fetch todos', error);
  // });

  db.collection('Users').find({ name: "Darth Vader"}).toArray().then((docs) => {
    console.log('--- Users ---');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (error) => {
    console.log('unable to fetch users', error);
  });

  // closes connection of MongoDB server
  db.close();
});