var firebase = require('firebase');

var options = {
  serviceAccount: require(process.env.FIREBASE_JSON_LOCATION),
  databaseURL: process.env.FIREBASE_DATABASE_URL
};

var db = null;

module.exports = function(callback) {
  if (db) {
    callback(db);
    return;
  }

  firebase.initializeApp(options);
  db = firebase.database();
  callback(db);
}