/**
 *  Name: Cowsay
 *  Description: Replies with a cowsay of a message.
 *  Usage: /cowsay String in
 *  Author: j <jay@jayhankins.me>
 */

const cowsay = require('cowsay');

function trigger(message, api, messageObj) {
  const msg = cowsay.say({
    text: message
  });
  api.sendMessage(messageObj.threadId, `\`\`\`${msg}\`\`\``);
}

module.exports = {
  trigger
};
