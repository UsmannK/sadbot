/**
 *  Name: Pokedex
 *  Description: Allows interaction with pokedex
 *  Usage: /pokedex <pokemon-name or pokemon-id> 
 */

var Pokedex = require('pokedex-promise-v2');
var fs = require('fs');
var request = require('request');
var P = new Pokedex();

var threadID;

function trigger(message, api, messageObj) {
  threadID = messageObj.threadID;
  getInfo(message.split(" ", 2), api);
}

function getInfo(msg, api) {
	if (msg[0] == 'move') {
		api.sendTypingIndicator(threadID, function() {
			getPokemonMoveByName(msg[1], function(msg){
				api.sendMessage(msg, threadID);
				if (close != null) {
					fs.unlink(close);
				}
			})
		})
			
	} else {
		api.sendTypingIndicator(threadID, function() {
			getPokemonName(msg[0], function(msg) {
				api.sendMessage(msg, threadID);
			})
		})
	}
}

function getPokemonMoveByName(move, callback) {
	var noMove = 'I couldn\'t find that move :/';

	P.getMoveByName(move)
	    .then(function(res) {
	    	if (res.length == 0) callback(noMove);
	    	var moveData = '';
	    	if (res.name) {
	    		moveData += 'Move: ' + res.name + '\n';
	    	} if (res.type.name) {
	    		moveData += 'Type: ' + res.type.name + '\n';
	    	} if (res.power) {
	    		moveData += 'Power: ' + res.power + '\n';
	    	} if (res.accuracy) {
	    		moveData += 'Accuracy: ' + res.accuracy;
	    	}
	    	callback(moveData);
	    })
	    .catch(function(err) {
	      callback(noMove);
	    });
}

function getPokemonName(name, callback) {
	var noPokemon = 'I couldn\'t find that pokemon :/';

	P.getPokemonByName(name)
	    .then(function(res) {
	    	if (res.length == 0) callback(noPokemon);
	    	var pokemonData = '```\n';
	    	if (res.name) {
	    		pokemonData += capitalizeFirst(res.name) + ' (#' + res.id + ')\n\n';
	    	} if (res.stats[0]) {
	    		for (var i in res.stats) {
	    			var stat = res.stats[i];
	    			pokemonData += capitalizeFirst(stat.stat.name) + ': ' + stat.base_stat + '\n';
	    		}
	    	} if (res.weight) {
	    		pokemonData += 'Weight: ' + res.weight + "\n";
	    	} if (res.height) {
	    		pokemonData += 'Height: ' + res.height;
	    	} 
	    	if (res.sprites.front_default) {
	    		var picStream = fs.createWriteStream('pokedex_' + res.id + '.png');
	    		picStream.on('close', function() {
		            var msg = { 
		            	body: pokemonData, 
		            	attachment: fs.createReadStream('pokedex_' + res.id + '.png') 
		            };
		            callback(msg, 'pokedex_' + res.id + '.png');
		       	});
	            request(res.sprites.front_default).pipe(picStream); 
	    	} else {
	    		callback(pokemonData);
	    	}
	    })
	    .catch(function(err) {
	      callback(noPokemon);
	    });
}

function capitalizeFirst(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
  trigger: trigger
}
