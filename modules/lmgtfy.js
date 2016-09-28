var superagent = require('superagent');

function trigger(message, api, messageObj) {
  var threadID = messageObj.threadID;
  var long_link = "http://lmgtfy.com/?q=" + message;
  var long_link = long_link.replace(" ", "+");
  var req_url = "http://api.lmgtfy.com/short_urls";
  superagent
    .post(req_url)
    .type('form')
    .send({"short_url[url]": long_link})
    .set('Accept', '*/*')
    .end(function(err, res) {
      if (err || !res.ok) {
        console.error(err);
      } else {
        if (res.body && res.body['Response'] == 'False') {
          var msg = res.body['Error'];
        } else {
          var msg = res.body['short_url'];
        }
      }
      api.sendMessage(msg, threadID);
    });
}

module.exports = {
  trigger: trigger
}
