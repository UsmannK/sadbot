var firebase = require('firebase');

var options = {
  serviceAccount: require(process.env.FIREBASE_JSON_LOCATION),
  databaseURL: process.env.FIREBASE_DATABASE_URL
};

var db = null;

module.exports = function(callback) {
  // return for callback if db exists
  if (db) {
    callback(db);
    return;
  }

  // initialize db if necessary
  firebase.initializeApp(options);
  db = firebase.database();
  callback(db);
}