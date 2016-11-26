/**
 *  Name: Aesthetic
 *  Description: Replies with ａｅｓｔｈｅｔｉｃ text
 *  Usage: /aesthetic <text>
 *  Author: j <jay@jayhankins.me>
 */

var a = require('aesthetics');

function trigger(message, api, messageObj) {
  threadID = messageObj.threadID;
  var figged = a(message);
  api.sendMessage(figged, threadID);
}

module.exports = {
  trigger: trigger
}
