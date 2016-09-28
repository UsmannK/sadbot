function trigger(message, api, messageObj) {
  threadID = messageObj.threadID;
  link = "http://lmgtfy.com/?q=" + message;
  api.sendMessage(link, threadID);
}

module.exports = {
  trigger: trigger
}
