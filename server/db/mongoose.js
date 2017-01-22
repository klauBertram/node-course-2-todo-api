const mongoose = require('mongoose');

// use built-in js promise
mongoose.Promise = global.Promise;

/* mongoose maintains db connection over time,
 * mongoose will queue up db request (CRUD)
 * since js is non-blocking, and will execute 
 * commands when the connection to the db is made
 */
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
  mongoose
};