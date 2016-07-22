const INVALID = 'INVALID';

function getThreadUsers(threadID, api) {
  api.getThreadInfo(threadID, function(err, info) {
    console.log(info);
    return info;
  });
}

function getIDFromName(user, users, threadID, api) {
  api.getUserID(user, function(err, data) {
    for (var id in data) {
      for (var userID in users) {
        if (id == userID) return userID;
      }
    }
    return INVALID;
  });
}

function kickUser(userID, threadID, api) {
  api.removeUserFromGroup(userID, threadID, function(err) {
    if(err) return callback(err);
    return;
  });
}

function trigger(user, threadID, api) { 
  console.log("here");
  var userID;
  getThreadUsers(threadID, api, function(info){
    console.log(info);
    var nicknames = info.nicknames;
    var users = info.participantIDs;

    for (var id in nicknames) {
      if (nicknames[id] == user) {
        userID = id;
      }
    }

    if (!userID) {
      userID = getIDFromName(user, users, threadID, api);
    }

    if (userID != INVALID) {
      kickUser(userID);
    }
  });
  

}

module.exports = {
  trigger: trigger
}
