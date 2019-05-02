/**
 *  Name: Cowsay
 *  Description: Replies with a cowsay of a message.
 *  Usage: /cowsay String in
 *  Author: j <jay@jayhankins.me>
 */

var cowsay = require('cowsay');

function trigger(message, api, messageObj) {
  threadID = messageObj.threadId;
  var msg = cowsay.say({
    text : message
  });
  api.sendMessage(threadID, '```' + msg + '```');

}

module.exports = {
  trigger: trigger
}
