// preference setters
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
  // parse args
  var option = command.substring(0, command.indexOf(' '));
  var setting = command.substring(command.indexOf(' ') + 1);
  if (option == '') {
    // list available prefs
    if (command == 'list') {
      var msg = {
        body: 'valid preferences:\n'
      };
      for (var preference in preferences) {
        msg.body += preference + '\n';
      }
      api.sendMessage(msg, threadID);
    } else if (command == 'reset') {
      // reset prefs to firebase defaults
      firebase(function(db) {
        var threadRef = db.ref(threadID);
        var preferencesRef = threadRef.child('/preferences');
        preferencesRef.once('value', function(snap) {
          for (var preference in snap.val()) {
            // ugly, break this down into a few lines?
            preferences[preference].module.trigger(snap.val()[preference], api, message);
          }
        })
      })
    } else {
      // not a valid special command
      var msg = {
        body: 'pls use format "prefs <option> <setting>" or "prefs list"'
      };
      api.sendMessage(msg, threadID);
    }
  } else if (option in preferences) {
    // preference exists
    // potential issue with passing prefs message to a different module?
    preferences[option].module.trigger(setting, api, message);
    // TODO: prevent overwriting the DB when the preference given is invalid
    firebase(function(db) {
      var threadRef = db.ref(threadID);
      var preferencesRef = threadRef.child('/preferences');
      // is there a better way to create an object with a variable key?
      options = {};
      options[option] = setting;
      preferencesRef.update(options);
    });
  } else {
    // preference not implemented in bot
    var msg = {
      body: 'not a valid preference'
    };
    api.sendMessage(msg, threadID);
  }
}

module.exports = {
  trigger: trigger
}