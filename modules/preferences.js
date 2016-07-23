var color = require('./color.js');
var emoji = require('./emoji.js');

var preferences = {
  color: {
    module: color
  },
  emoji: {
    module: emoji
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
        body: 'valid preferences:\n'
      };
      for (var preference in preferences) {
        msg.body += preference + '\n';
      }
      api.sendMessage(msg, threadID);
    } else if (command == 'reset') {
      firebase(function(db) {
        var threadRef = db.ref(threadID);
        threadRef.once('value', function(snap) {
          for (var preference in snap.val()) {
            preferences[preference].module.trigger(snap.val()[preference], api, message);
          }
        })
      })
    } else {
      var msg = {
        body: 'pls use format "prefs <option> <setting>" or "prefs list"'
      };
      api.sendMessage(msg, threadID);
    }
  } else if (option in preferences) {
    for (var preference in preferences) {
      if (preference == option) {
        // TODO: indicate if a preference failed its trigger so it doesnt get stored in the database
        preferences[preference].module.trigger(setting, api, message);
        firebase(function(db) {
          var threadRef = db.ref(threadID);
          options = {};
          options[option] = setting;
          threadRef.update(options);
        });
        break;
      }
    }
  } else {
    var msg = {
      body: 'not a valid preference'
    };
    api.sendMessage(msg, threadID);
  }
}

module.exports = {
  trigger: trigger
}