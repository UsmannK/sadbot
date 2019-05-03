/**
 *  Name: Aesthetic
 *  Description: Replies with ａｅｓｔｈｅｔｉｃ text
 *  Usage: /aesthetic <text>
 *  Author: j <jay@jayhankins.me>
 */

var a = require('aesthetics');

function trigger(message, api, messageObj) {
  threadID = messageObj.threadId;
  var figged = a(message);
  api.sendMessage(threadID, figged);
}

module.exports = {
  trigger: trigger
}
