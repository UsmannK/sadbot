function trigger(args, api, message) {
  threadID = message.threadId;
  api.sendMessage(threadID, message.message);
}

module.exports = {
  trigger: trigger
}
