var firebase = require('../firebase.js')

const INVALID = 'INVALID';
const PLUS = 'PLUS';
const MINUS = 'MINUS';
const CHECK = 'CHECK';

function trigger(user, api, message) {
  var originalMsg = message.body.substring(1);
  if (originalMsg.startsWith(' ')) originalMsg = originalMsg.substring(1);
  var mode;
  if (originalMsg.startsWith('++')) {
    mode = PLUS;
  } else if (originalMsg.startsWith('--')) {
    mode = MINUS;
  } else if (originalMsg.startsWith('karma')) {
    mode = CHECK;
  } else {
    return;
  }
  // grab threadID
  var threadID = message.threadID;
  // get users and nicks
  getThreadUsers(threadID, api, function(info) {
    var nicks = info.nicknames;
    var users = info.participantIDs;
    // check if user used a nickname
    for (var id in nicks) {
      if (nicks[id] == user) {
        // execute appropriate action
        doKarma(id, threadID, message.senderID, api, mode);
        return;
      }
    }
    // check if user used real name
    getIDFromName(user, users, threadID, api, function(userID) {
      if (userID != INVALID) {
        // execute appropriate action
        doKarma(userID, threadID, message.senderID, api, mode);
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

function doKarma(userID, threadID, senderID, api, mode) {
  isCooledDown(threadID, senderID, function(cooled) {
    if (mode == PLUS && userID != senderID && cooled) {
      doModify(userID, threadID, senderID, api, true);
    } else if (mode == MINUS && userID != senderID && cooled) {
      doModify(userID, threadID, senderID, api, false);
    } else if (mode == CHECK) {
      doCheck(userID, threadID, api);
    }
  });
}

function doModify(userID, threadID, senderID, api, plus) {
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
        if (snap.val() && snap.val()[userID]) {
          karma[userID] = snap.val()[userID];
        }
        // change val
        if (plus) {
          karma[userID]++;
        } else {
          karma[userID]--;
        }
        // update in db
        karmaRef.update(karma);
        // send confirmation message
        var msg = {
          body: obj[userID].firstName + ' has ' + karma[userID] + ' karma'
        }
        api.sendMessage(msg, threadID);
        // get cooldown settings
        var cooldownRef = threadRef.child('/cooldown');
        // get current timestamp
        var d = Date.now();
        // options object
        var opt = {};
        opt[senderID] = d;
        // update timestampt
        cooldownRef.update(opt);
      });
    });
  });
}

function doCheck(userID, threadID, api) {
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
      karma = 0;
      karmaRef.once('value', function(snap) {
        // check if user already has karma
        if (snap.val() && snap.val()[userID]) {
          karma = snap.val()[userID];
        }
        // send confirmation message
        var msg = {
          body: obj[userID].firstName + ' has ' + karma + ' karma'
        }
        api.sendMessage(msg, threadID);
      });
    });
  });
}

function isCooledDown(threadID, senderID, callback) {
  firebase(function(db) {
    // thread settings
    var threadRef = db.ref(threadID);
    // get cooldown settings
    var cooldownRef = threadRef.child('/cooldown');
    cooldownRef.once('value', function(snap) {
      // check if theres a timestamp
      if (snap.val() && snap.val()[senderID]) {
        // if so, make a new Date based on it
        var d = new Date(snap.val()[senderID]);
        // callback with whether 30s (30k ms) has passed
        callback(Date.now() - d.getTime() > 30000);
        return;
      }
      // callback with true because no timestamp
      callback(true);
    });
  });
}

module.exports = {
  trigger: trigger
}