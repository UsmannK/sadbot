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
	console.log(tweetURL);
}

module.exports = {
  trigger: trigger
}
