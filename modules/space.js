var superagent = require('superagent');
var request = require('request');
var fs = require("fs");

function trigger(message, threadID, api) {
  console.log("here");
    api.sendTypingIndicator(message.threadID, function() {
    });
    superagent
      .get('https://www.reddit.com/r/spaceporn.json')
      .set('Accept', 'application/json')
      .end(function(err, res) {
      var index = Math.floor(Math.random() * 22);
      while(true) {
        var url = res.body['data']['children'][index]['data']['url'];
        if (url.indexOf("jpg") >= 0 || url.indexOf("png") >= 0) {
          break;
        } else {
          index = Math.floor(Math.random() * 22);
        }
      }
      var picStream = fs.createWriteStream('imgs/space/' + index + ".png");
      request(res.body['data']['children'][index]['data']['url']).pipe(picStream);
      picStream.on('close', function() {
        var msg = {
                    body: res.body['data']['children'][index]['data']['title'],
                    attachment: fs.createReadStream('imgs/space/' + index + ".png")
                  }
        api.sendMessage(msg, message.threadID);
      });
  });
}

module.exports = {
  trigger: trigger
}
