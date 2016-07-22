function trigger(message, threadID, api) {
  var spaceLoc = message.indexOf(' ');
  api.sendMessage(message, threadID);
}

module.exports = {
  trigger: trigger
}
