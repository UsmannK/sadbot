var giphy = require('giphy-api')();

function trigger(search, api, message) {
  threadID = message.threadID;
  giphy.random(search).then(function(res) {
    var msg = {
      body: res.data.caption,
      url: res.data.url
    };
    api.sendMessage(msg, threadID);
  });
}

module.exports = {
  trigger: trigger
}
