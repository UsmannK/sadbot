function trigger(args, api, message) {
  threadID = message.threadId;
  api.sendMessage(threadID, args);
}

module.exports = {
  trigger: trigger
}
