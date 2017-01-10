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

  // insert documents to collection
  // db.collection('Todos').insertOne({
  //   text: 'I am Darth Vader',
  //   completed: false
  // }, (error, result) => {
  //   if(error){
  //     return console.log('unable to insert todo', error);
  //   }

  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // insert new doc into Users collection (name, age, location)
  // db.collection('Users').insertOne({
  //   name: 'Darth Vader',
  //   age: 150,
  //   location: 'Death Star'
  // }, (error, result) => {
  //   if(error){
  //     return console.log('unable to insert todo', error);
  //   }

  //   // console.log(JSON.stringify(result.ops, undefined, 2));
  //   console.log(result.ops[0]._id.getTimestamp());
  // });

  // closes connection of MongoDB server
  db.close();
});