var firebase = require('firebase');
var config = require('config');

var db = null;

module.exports = function(callback) {
  // return for callback if db exists
  if (db) {
    callback(db);
    return;
  }

  // initialize db if necessary
  firebase.initializeApp({
    serviceAccount: config.get('firebase.serviceAccount'),
    databaseURL: config.get('firebase.databaseURL')
  });
  db = firebase.database();
  callback(db);
}