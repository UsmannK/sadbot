var superagent = require('superagent');

function trigger(message, api, messageObj) {
    threadID = messageObj.threadID;
    api.sendTypingIndicator(threadID, function() {
    });
    superagent
      .get('https://www.reddit.com/r/spaceporn.json')
      .set('Accept', 'application/json')
      .end(function(err, res) {
      var index = Math.floor(Math.random() * 22);
      // Skip links that do not directly link to an image
      while(true) {
        var url = res.body['data']['children'][index]['data']['url'];
        if (url.indexOf("jpg") >= 0 || url.indexOf("png") >= 0) {
          break;
        } else {
          index = Math.floor(Math.random() * 22);
        }
      }
      var msg = {
                  body: res.body['data']['children'][index]['data']['title'],
                  url: res.body['data']['children'][index]['data']['url']
                }
      api.sendMessage(msg, threadID);
  });
}

module.exports = {
  trigger: trigger
}
