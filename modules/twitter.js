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
	//https://twitter.com/AnkitPancakes/status/788914839007748097

	console.log(tweetURL);
	var tweetID = splitAtStatus(tweetURL);
	console.log(tweetID);
	T.get('statuses/show/:id', {'id': tweetID}, function (err, data, response) {
		console.log(data.user.screen_name);
		console.log(data.text);
	});
}

function splitAtStatus(url) {
	var id = url.split("/status/");
	return id[1];
}

module.exports = {
  trigger: trigger
}
