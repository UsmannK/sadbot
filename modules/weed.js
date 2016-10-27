/**
 *  Name: Weed
 *  Description: Looks up information about strains
 *  Usage: /weed <strain-name>
 */

 var cannabis = require('cannabis-reports');

 function trigger(message, api, messageObj) {
 	threadID = messageObj.threadID;
 	search(message, function(ucpc){
 		console.log(ucpc);
 		buildResult(ucpc, function(msg){
 			api.sendMessage(msg, threadID);
 		});
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
 		console.log(err);
 	})
 }

 function buildResult(ucpc, callback) {
 	var strain = '```\n';
 	getStrain(ucpc, function(info) {
 		strain += info.name;
 		if (info.genetics.names) {
 			strain += '(' + info.genetics.names + ')\n\n'
 		} else {
 			'\n\n';
 		}

 		getEffects(ucpc, function(effects) {
 			for (var effect in effects) {
 				if (effects.hasOwnProperty(effect)) {
 					if (effect != 'reviews') {
 						strain += capitalizeFirst(effect) + ': ' + effects[effect] + '\n';
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

 module.exports = {
 	trigger: trigger
 }
