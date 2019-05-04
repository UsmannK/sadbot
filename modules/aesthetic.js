/**
 *  Name: Aesthetic
 *  Description: Replies with ａｅｓｔｈｅｔｉｃ text
 *  Usage: /aesthetic <text>
 *  Author: j <jay@jayhankins.me>
 */

const a = require('aesthetics');

function trigger(message, api, messageObj) {
  const figged = a(message);
  api.sendMessage(messageObj.threadId, figged);
}

module.exports = {
  trigger
};
