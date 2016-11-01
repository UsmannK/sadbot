/**
 *  Name: Weed
 *  Description: Looks up information about strains
 *  Usage: /weed <strain-name>
 */

var cannabis = require('cannabis-reports');
var giphy = require('giphy-api')();

const INVALID = 'I couldn\'t find that strain :/';

function trigger(message, api, messageObj) {
	threadID = messageObj.threadID;
	search(message, function(ucpc){
		api.sendTypingIndicator(threadID, function() {
	 		buildResult(ucpc, function(msg){
	 			api.sendMessage(msg, threadID);
	 		});
 		})
	});
}

function search(query, callback) {
	cannabis.Strain
	.search(query)
	.then(function(res){
		var i;
		for (i in res) {
			if ((res[i].reviews.count > 0) && (res[i].ucpc)) {
				break;
			}
		}
		if (res[i].ucpc) {
			callback(res[i].ucpc);
		} else {
			callback(null);
		}
	})
	.catch(function(err){
		callback(INVALID);
	})
}
function buildResult(ucpc, callback) {
	if (ucpc == INVALID) {
		var msg = {
			body: INVALID,
			url: ''
		};
		giphy.random('weed', function(err, res) {
	    if (err) return callback(INVALID);
	    	msg.url = res.data.url;
	    	callback(msg);
	  	});
	}

	var strain = '```\n';
	getStrain(ucpc, function(info) {
		strain += info.name;
		if (info.genetics.names) {
			strain += ' (' + info.genetics.names + ')\n\n'
		} else {
			strain += '\n\n';
		}
		getEffects(ucpc, function(effects) {
			for (var effect in effects) {
				if (effects.hasOwnProperty(effect)) {
					var num = twoDecimals(effects[effect]);
					if ((effect != 'reviews') && (num != '0.00')) {
						strain += capitalizeFirst(effect).replace('_', ' ') + ': ' + num + '\n';
					}
				}
			}
			callback(strain);
		});
	});
}

function getStrain(ucpc, callback) {
	cannabis.Strain
	.strain(ucpc)
	.then(function(res){
		callback(res);
	})
	.catch(function(err){
		callback(null);
	})
}

function getEffects(ucpc, callback) {
	cannabis.Strain
	.effectsFlavors(ucpc)
	.then(function(res){
		callback(res);
	})
	.catch(function(err){
		callback(null);
	})
}

function capitalizeFirst(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function twoDecimals(num) {
	return parseFloat(Math.round(num * 100) / 100).toFixed(2);
}

module.exports = {
	trigger: trigger
}
