var superagent = require('superagent');
var request = require('request');
var fs = require('fs');

function trigger(comic, api, messageObj) {
    threadID = messageObj.threadID;
    var url;
    if(comic === "today") {
      url = "http://xkcd.com/info.0.json";
    } else if(comic === "random") {
      url = 'http://xkcd.com/' + randomIntFromInterval(1, 1715) + '/info.0.json';
    } else {
      url = 'http://xkcd.com/' + comic + '/info.0.json';
    }
    var end = api.sendTypingIndicator(threadID, function() {
      superagent
        .get(url)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          if (err || !res.ok) {
            console.error("Error getting XKCD comic");
          } else {
            var picStream = fs.createWriteStream('xkcd_' + comic + '.png');
            picStream.on('close', function() {
              var msg = { body: res.body['safe_title'], attachment: fs.createReadStream('xkcd_' + comic + '.png') }
              api.sendMessage(msg, threadID, function(err, messageInfo) {
                // Delete image after message has sent
                fs.unlink('xkcd_' + comic + '.png');
              });
            });
            request(res.body['img']).pipe(picStream); 
          }
          end();
      });
    });
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

module.exports = {
    trigger: trigger
}
