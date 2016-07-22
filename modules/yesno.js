var superagent = require('superagent');

function trigger(_, api, message) {
  threadID = message.threadID;
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
