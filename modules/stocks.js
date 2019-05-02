/**
 *  Name: Stocks
 *  Description: Gets current stock asking price and change
 *  Usage: /stocks <symbol>
 */

var superagent = require('superagent');

function trigger(message, api, messageObj) {
	var args = messageObj.message.split(" ");
	var threadID = messageObj.threadId;
	if(typeof args[1] == 'undefined') {
		console.error('bad arguments');
	}
	superagent
  	.get('https://api.iextrading.com/1.0/stock/'+args[1]+'/quote')
  	.then(res => {
    	const response = res.body.symbol + " $" + res.body.latestPrice + " " + arrow(res.body.change) + " " + res.body.change + " (" + (res.body.changePercent* 100).toFixed(2) + '%' + ")";
			api.sendMessage(threadID, response);
  	})
  	.catch(err => {
    	console.error(err);
  	});
}

function arrow(change) {
	if(change > 0) {
		return String.fromCodePoint(0x2B06);
	}
	return String.fromCodePoint(0x2B07);
}

module.exports = {
	trigger: trigger
}