var color = require('./color.js');

var defaults = {
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
  } else if (option in defaults) {
    for (var key in defaults) {
      if (key == option) {
        defaults[key].module.trigger(setting, api, message);
        firebase(function(db) {
          var threadRef = db.ref(threadID);
          threadRef.set({
            option: setting
          });
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