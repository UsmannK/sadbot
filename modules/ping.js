const INVALID = 'INVALID';

function trigger(user, api, message) {
  // get threadID
  var threadID = message.threadID;
  getThreadUsers(threadID, api, function(info) {
    // get username info
    var nicks = info.nicknames;
    var users = info.participantIDs;

    // check nicknames
    for (var id in nicks) {
      if (nicks[id] == user) {
        ping(message.senderID, id, api);
        return;
      }
    }

    // check real names
    getIDFromName(user, users, threadID, api, function(userID) {
      if (userID != INVALID) {
        ping(message.senderID, userID, api);
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

function ping(pingerID, pingeeID, api) {
  // get pinger name
  api.getUserInfo(pingerID, function(err, obj) {
    if (err) return console.error(err);
    msg = {
      body: obj[pingerID].firstName + ' has pinged you!'
    };
    // send notification
    api.sendMessage(msg, pingeeID);
  });
}

module.exports = {
  trigger: trigger
}