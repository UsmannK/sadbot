/**
 *  Name: Cowsay
 *  Description: Replies with a cowsay of a message.
 *  Usage: /cowsay String in
 *  Author: j <jay@jayhankins.me>
 */

var cowsay = require('cowsay');

function trigger(message, api, messageObj) {
  threadID = messageObj.threadID;
  var msg = cowsay.say({
    text : message
  });
  api.sendMessage('```' + msg + '```', threadID);

}

module.exports = {
  trigger: trigger
}
