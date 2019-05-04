function trigger(args, api, message) {
  api.sendMessage(message.threadId, args);
}

module.exports = {
  trigger
};
