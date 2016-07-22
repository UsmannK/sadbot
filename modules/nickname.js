const INVALID = 'INVALID';

function trigger(args, api, message) {
  threadID = message.threadID;
  var splitArgs = args.split(",");
  if(splitArgs.length < 2) {
    console.log("Malformed request");
    return;
  }
  givenName = splitArgs[0];
  newNickName = splitArgs[1];
  if(givenName.length < 1 || newNickName.length < 1) {
    console.log("Malformed Request");
    return;
  }
  getThreadUsers(threadID,api,function(info){
    var nicknames = info.nicknames;
    var users = info.participantIDs;


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
  api.getUserID(user, function(err, data) {
    for (var id in data) {
      for (var userID in users) {
        if (data[id].userID == users[userID]) callback(users[userID]);
      }
    }
    return INVALID;
  });
}



module.exports = {
  trigger: trigger
}
