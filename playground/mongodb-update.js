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

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('587440156359863fc2523977')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // });

  // update name
  // inc age by 1
  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('587445e56359863fc2523a82')
  }, {
    $inc: {
      age: 1
    },
    $set: {
      name: 'Tony Stark'
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result)
  });


  // closes connection of MongoDB server
  db.close();
  console.log('disconnected to MongoDB server')
});