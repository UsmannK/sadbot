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
	//https%3A%2F%2Ftwitter.com%AnkitPancakes%2Fstatus%788914839007748097
	console.log(tweetURL);
	T.get('statuses/show/:id', {'id': '788914839007748097'}, function (err, data, response) {
		console.log(data.user.screen_name);
		console.log(data.text);
	});
}
//788914839007748097

module.exports = {
  trigger: trigger
}
