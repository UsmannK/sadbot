/**
 *  Name: Stocks
 *  Description: Gets current stock asking price and change
 *  Usage: /stocks <symbol>
 */

const superagent = require('superagent');

function trigger(message, api, messageObj) {
  const args = messageObj.message.split(' ');
  const threadID = messageObj.threadId;
  if (typeof args[1] === 'undefined') {
    return;
  }
  superagent
    .get(`https://api.iextrading.com/1.0/stock/${args[1]}/quote`)
    .then(res => {
      const response =
        `${res.body.symbol} $${res.body.latestPrice} ${arrow(res.body.change)} ${
          res.body.change
        } (${(res.body.changePercent * 100).toFixed(2)}%` + `)`;
      api.sendMessage(threadID, response);
    })
    .catch(err => {
      return err;
    });
}

function arrow(change) {
  if (change > 0) {
    return String.fromCodePoint(0x2b06);
  }
  return String.fromCodePoint(0x2b07);
}

module.exports = {
  trigger
};
