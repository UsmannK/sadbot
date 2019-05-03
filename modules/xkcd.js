var superagent = require('superagent');
var request = require('request');
var fs = require('fs');

function trigger(comic, api, messageObj) {
  threadID = messageObj.threadId;
  var url;
  if (comic) {
    if (comic === "random") {
      url = 'http://xkcd.com/' + randomIntFromInterval(1, 2143) + '/info.0.json';
    } else {
      url = 'http://xkcd.com/' + comic + '/info.0.json';
    }
  } else {
    url = 'https://xkcd.com/info.0.json';
    comic = 'today';
  }
  let path = 'xkcd_' + comic + '.png';

  superagent
    .get(url)
    .set('Accept', 'application/json')
    .end(function(err, res) {
      if (err || !res.ok) {
        console.error("Error getting XKCD comic: %o", err);
      } else {
        var picStream = fs.createWriteStream(path);
        picStream.on('close', function() {
          api.sendAttachmentFile(threadID, path).then(function() {
            fs.unlink(path, (err) => {
              if (err) {
                console.error(err)
              }
            });
          });
        });
        request(res.body['img']).pipe(picStream); 
      }
  });
    
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

module.exports = {
    trigger: trigger
}
