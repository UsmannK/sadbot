function trigger(emoji, api, message) {
  var threadID = message.threadID;
  // TODO: validate facebook friendly emojis so sadbot can give an error
  api.changeThreadEmoji(emoji, threadID, function(err) {
    if (err) return console.error(err);
  });
}

module.exports = {
  trigger: trigger
}