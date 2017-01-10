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

  // deleteMany
  // db.collection('Todos').deleteMany({text: 'eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  // deleteOne
  // db.collection('Todos').deleteOne({text: 'eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  // findOneAndDelete, returns document
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });

  // deleteMany duplicates
  // db.collection('Users').deleteMany({name: 'Darth Vader'}).then((result) => {
  //   console.log(result);
  // });

  // findOneAndDelete, find by id
  db.collection('Users').findOneAndDelete({_id: new ObjectID('58743c4e6359863fc2523835')}).then((result) => {
    console.log(JSON.stringify(result, undefined, 2));
  });

  // closes connection of MongoDB server
  // db.close();
});