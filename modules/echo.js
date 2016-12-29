var utils = require('../utils');
function trigger(message, api, messageObj) {
  threadID = messageObj.threadID;
  var spaceLoc = message.indexOf(' ');
  utils.sendMessage(message, threadID);
}

module.exports = {
  trigger: trigger
}
