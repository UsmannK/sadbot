const INVALID = 'INVALID';

function trigger(args, api, message) {
  threadID = message.threadID;
  var splitArgs = args.split(",");

  givenName = splitArgs[0];
  newNickName = splitArgs[1];
  if((splitArgs.length != 1) && (givenName.length < 1 || newNickName.length < 1)) {
    console.log("Malformed Request");
    return;
  }
  getThreadUsers(threadID,api,function(info){
    var nicknames = info.nicknames;
    var users = info.participantIDs;

    if (splitArgs.length == 1) {
      //Get some dank nicknames, given a name (defaults to message sender)
      getIDFromName(givenName, users, threadID, api, function(userID) {
        var id = (userID != INVALID) ? userID : message.senderID;
        api.getUserInfo(id, function(err, obj) {
          if (err) return console.error(err);
          if (nicknames[id]) {
            api.sendMessage(obj[id].firstName + "'s nickname is " + nicknames[id], threadID);
          } else {
            api.sendMessage(obj[id].firstName + " does not have a nickname", threadID);
          }
        });
        return;
      });
      return;
    }

    //Look up user by their nickname
    for(var id in nicknames) {
      if(nicknames[id] == givenName) {
        //This is the matching user
        setNickname(newNickName, threadID, id, api);
        return;
      }
    }  
    //Look up user by their actual name
    getIDFromName(givenName, users, threadID, api, function(userID) {
      if (userID != INVALID) {
        setNickname(newNickName, threadID, userID, api);
        return;
      }
    });
  });
  
}

function setNickname(newNick,threadID,userID, api) {
  api.changeNickname(newNick,threadID,userID,function(err){
    if(err) {
      return console.log(err);
    }
    return;
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



module.exports = {
  trigger: trigger
}
