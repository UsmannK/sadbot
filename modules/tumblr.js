var OAuth = require('oauth').OAuth;
var config = require('config');

var appConsumerKey = config.get('tumblr.consumerKey');
var appConsumerSecret = config.get('tumblr.consumerSecret');

// Used for testing an API call with aquired token and secret
var protectedResourceUrl = 'https://api.tumblr.com/v2/blog/developers.tumblr.com/info';

// Tumblr endpoints
var authorizeUrl = 'https://www.tumblr.com/oauth/authorize';
var requestTokenUrl = 'https://www.tumblr.com/oauth/request_token';
var accessTokenUrl = 'https://www.tumblr.com/oauth/access_token';

// OAuth(requestTokenUrl, accessTokenUrl, consumerKey, consumerSecret, OAuthVersion, callbackUrl, digest)
var oa = new OAuth(
  requestTokenUrl,
  accessTokenUrl,
  appConsumerKey,
  appConsumerSecret,
  '1.0A',
  'http://73.102.44.214:1203/callback',
  'HMAC-SHA1'
);
var token;
var secret;

function trigger(message, api, messageObj) {
    threadID = messageObj.threadID;
    oa.getOAuthRequestToken(function (err, token, secret) {
      if (err) {
        console.error('\tFailed with error', err);
        return next(err);
      }
      console.log('\ttoken %s | secret %s', token, secret);

      // Save generated tokens to session
      this.token = token;
      this.secret = secret;

      var authUrl = authorizeUrl + '?oauth_token=' + token;
      api.sendMessage(authUrl, threadID);
    });
}

module.exports = {
  trigger: trigger
}
