var config = require('config');
var Twit = require('twit');

var T = new Twit({
  consumer_key: config.get('twitter.consumerKey'),
  consumer_secret: config.get('twitter.consumerSecret'),
  access_token: config.get('twitter.accessToken'),
  access_token_secret: config.get('twitter.accessTokenSecret'),
  timeout_ms: 60*1000,  // optional HTTP request timeout to apply to all requests.
})


function trigger(tweetURL, api, message) {
	var threadID = message.threadID;
	var tweetID = splitAtStatus(tweetURL);
	var response = "";
	
	T.get('statuses/show/:id', {'id': tweetID, 'include_entities': true}, function (err, data, response) {
		//console.log(data.entities);
		var picURL = "";
		var x = data.entities.hasOwnProperty('media');

		//handle with image
		if (x === true) {
			console.log("attaching image");
			picURL = data.entities.media[0].media_url;
			response = {
				body: '@' + data.user.screen_name + ' tweeted: ' + data.text,
				url: picURL
			}
		}
		else {
			console.log("no image");
			response = '@' + data.user.screen_name + ' tweeted: ' + data.text;
		}

		//send message 	
		api.sendMessage(response, threadID);
	});
}

function splitAtStatus(url) {
	var id = url.split("/status/");
	return id[1];
}

module.exports = {
  trigger: trigger
}
