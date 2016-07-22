var superagent = require('superagent');

function trigger(message, threadID, api) {
  superagent
    .get('http://yesno.wtf/api')
    .set('Accept', 'application/json')
    .end(function(err, res) {
      var msg = {
        body: res.body.answer,
        url: res.body.image
      };
      api.sendMessage(msg, threadID);
    });
}

module.exports = {
  trigger: trigger
}