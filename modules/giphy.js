var giphy = require('giphy-api')();

function trigger(search, threadID, api) {
  giphy.random(search).then(function(res) {
    var msg = {
      body: res.data.caption,
      url: res.data.url
    }
    api.sendMessage(msg, threadID);
  });
}

module.exports = {
  trigger: trigger
}