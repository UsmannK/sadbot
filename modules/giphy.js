var giphy = require('giphy-api')();

function trigger(message, api, messageObj) {
  threadID = messageObj.threadId;
  giphy.random(search, function(err, res) {
    if (err) return console.error(err);
    var msg = res.data.url;
    api.sendMessage(threadId, msg);
  });
}

module.exports = {
  trigger: trigger
}
