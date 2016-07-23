var defaults = [
  'color',
  'emoji'
];

var color = require('./color.js');

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
  } else if (defaults.indexOf(option) != -1) {
    if (option == 'color') {
      color.trigger(setting, api, message);
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