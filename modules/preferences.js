var color = require('./color.js');

var preferences = {
  color: {
    module: color
  }
};

var firebase = require('../firebase.js')

function trigger(command, api, message) {
  var threadID = message.threadID;
  var option = command.substring(0, command.indexOf(' '));
  var setting = command.substring(command.indexOf(' ') + 1);
  if (option == '') {
    if (command == 'list') {
      var msg = {
        body: 'list defaults'
      };
      api.sendMessage(msg, threadID);
    } else {
      var msg = {
        body: 'pls use format "defaults <option> <setting>" or "defaults list"'
      };
      api.sendMessage(msg, threadID);
    }
  } else if (option in preferences) {
    for (var preference in preferences) {
      if (preference == option) {
        preferences[preference].module.trigger(setting, api, message);
        firebase(function(db) {
          var threadRef = db.ref(threadID);
          options = {};
          options[option] = setting;
          threadRef.set(options);
        });
        return;
      }
    }
  } else {
    var msg = {
      body: 'not a valid default'
    };
    api.sendMessage(msg, threadID);
  }
}

module.exports = {
  trigger: trigger
}