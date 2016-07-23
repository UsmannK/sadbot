/**
 *  Name: Cowsay
 *  Description: Replies with a cowsay of a message.
 *  Usage: /cowsay String in
 *  Author: j <jay@jayhankins.me>
 */

var superagent = require('superagent');

function trigger(message, api, messageObj) {
  threadID = messageObj.threadID;
  superagent
  .get('http://cowsay.morecode.org/say')
  .set('Accept', 'application/json')
  .query({ format: 'json', message: message })
  .end(function(err, res) {
    if (err) {
      return;
    }

    api.sendMessage('```' + res.body.cow + '```', threadID);
    });
}

module.exports = {
  trigger: trigger
}
