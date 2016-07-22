const INVALID = 'INVALID';

function getThreadUsers(threadID, api, callback) {
  api.getThreadInfo(threadID, function(err, info) {
    callback(info);
  });
}

function getIDFromName(user, users, threadID, api, callback) {
  api.getUserID(user, function(err, data) {
    for (var id in data) {
      for (var userID in users) {
        if (data[id].userID == users[userID]) callback(users[userID]);
      }
    }
    return INVALID;
  });
}

function kickUser(userID, threadID, api) {
  api.removeUserFromGroup(userID, threadID, function(err) {
    return;
  });
}

function trigger(user, threadID, api) { 
  getThreadUsers(threadID, api, function(info){
    var nicknames = info.nicknames;
    var users = info.participantIDs;

    for (var id in nicknames) {
      if (nicknames[id] == user) {
        kickUser(id, threadID, api);
        return;
      }
    }

    getIDFromName(user, users, threadID, api, function(userID) {
      if (userID != INVALID) {
        kickUser(userID, threadID, api);
      }
    });
  });
}

module.exports = {
  trigger: trigger
}
