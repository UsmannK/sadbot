/**
 *  Name: Figlet
 *  Description: Replies with a figlet of a message.
 *  Usage: /figlet String in
 *  Author: j <jay@jayhankins.me>
 */

var figlet = require('figlet');

function trigger(message, api, messageObj) {
  threadID = messageObj.threadId;
  var figged = '```\n' + makeFig(message) + '```';
  api.sendMessage(threadID, figged);
}

function makeFig(message) {
	return figlet.textSync(message, {
	    font: 'Small'
	}, function(err, data) {
	    if (err) {
	        console.log('Something went wrong...');
	        console.dir(err);
	        return;
	    }
	});
}

module.exports = {
  trigger: trigger
}
