function getIDFromName(user, threadID, api, callback) {
  api.getUserID(user, function(err, data) {
    callback(data[0].userID);
  });
}

function addUser(userID, threadID, api) {
  api.addUserToGroup(userID, threadID, function(err) {
    return;
  });
}

function trigger(user, api, message) { 
  var threadID = message.threadID;
  getIDFromName(user, threadID, api, function(userID) {
      addUser(userID, threadID, api);
  });
}

module.exports = {
  trigger: trigger
}
