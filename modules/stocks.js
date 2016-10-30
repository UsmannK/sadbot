/**
 *  Name: Stocks
 *  Description: Gets current stock asking price and change
 *  Usage: /stocks <symbol>
 */

var yfinance = require('yfinance');

function trigger(search, api, messageObj) {
	var args = messageObj.body.split(" ");
	var threadID = messageObj.threadID;
	if(typeof args[2] == 'undefined') {
		console.error('bad arguments');
	}
	console.log(args[2]);
	var end = api.sendTypingIndicator(threadID, function() {
		yfinance.getQuotes(args[2], function (err, data) {
			if(err) {
				console.error(err);
			} else if(data[0].Ask != null) {
				var response = data[0].symbol.toUpperCase() + " $" + data[0].Ask + " " + arrow(data[0].Change) + " " + data[0].Change + " (" + data[0].ChangeinPercent + ")";
				api.sendMessage(response, threadID);
				console.log(data);
			}
		});
		end();
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