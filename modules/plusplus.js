var firebase = require('../firebase.js')

const INVALID = 'INVALID';

function trigger(user, api, message) {
  // grab threadID
  var threadID = message.threadID;
  // get users and nicks
  getThreadUsers(threadID, api, function(info) {
    var nicks = info.nicknames;
    var users = info.participantIDs;
    // check if user used a nickname
    for (var id in nicks) {
      if (nicks[id] == user) {
        // no self karma
        if (id == message.senderID) return;
        // otherwise plusplus
        plusPlus(id, threadID, api);
        return;
      }
    }
    // check if user used real name
    getIDFromName(user, users, threadID, api, function(userID) {
      if (userID != INVALID) {
        // no self karma
        if (userID == message.senderID) return;
        // otherwise plusplus
        plusPlus(userID, threadID, api);
        return;
      }
    });
  });
}

function getThreadUsers(threadID, api, callback) {
  api.getThreadInfo(threadID, function(err, info) {
    callback(info);
  });
}

function getIDFromName(user, users, threadID, api, callback) {
  if (!user) return callback(INVALID);
  api.getUserID(user, function(err, data) {
    if (err) return console.log(err);
    for (var id in data) {
      for (var userID in users) {
        if (data[id].userID == users[userID]) return callback(users[userID]);
      }
    }
    return callback(INVALID);
  });  
}

function plusPlus(userID, threadID, api) {
  // get real names
  api.getUserInfo(userID, function(err, obj) {
    if (err) return console.error(err);
    // access db
    firebase(function(db) {
      // thread
      var threadRef = db.ref(threadID);
      // karma settings
      var karmaRef = threadRef.child('/karma');
      // initialize karma to 0
      var karma = {};
      karma[userID] = 0;
      karmaRef.once('value', function(snap) {
        // check if user already has karma
        if (snap.val()[userID]) {
          karma[userID] = snap.val()[userID];
        }
        // increment
        karma[userID]++;
        // update in db
        karmaRef.update(karma);
        // send confirmation message
        var msg = {
          body: obj[userID].firstName + " has " + karma[userID] + " karma"
        }
        api.sendMessage(msg, threadID);
      });
    });
  });
}

module.exports = {
  trigger: trigger
}