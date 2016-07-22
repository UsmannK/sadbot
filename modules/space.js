var superagent = require('superagent');
var request = require('request');
var fs = require("fs");

function trigger(message, threadID, api) {
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
      var picStream = fs.createWriteStream('imgs/space/' + index + ".png");
      picStream.on('close', function() {
        var msg = {
                    body: res.body['data']['children'][index]['data']['title'],
                    attachment: fs.createReadStream('imgs/space/' + index + ".png")
                  }
        api.sendMessage(msg, threadID);
      });
      request(res.body['data']['children'][index]['data']['url']).pipe(picStream);
  });
}

module.exports = {
  trigger: trigger
}
