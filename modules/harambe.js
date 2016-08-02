function trigger(search, api, message) {
  threadID = message.threadID;
  var msg = {
    url: "http://gph.is/29m75rs"
  };
  api.sendMessage(msg, threadID);
}

module.exports = {
  trigger: trigger
}
