function trigger(message, api, messageObj) {
  threadID = messageObj.threadID;
  var spaceLoc = message.indexOf(' ');
  api.sendMessage(message, threadID);
}

module.exports = {
  trigger: trigger
}
