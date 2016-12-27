const OAuth = require('oauth').OAuth;
var config = require('config');

const appConsumerKey = config.get('tumblr.consumerKey');
const appConsumerSecret = config.get('tumblr.consumerSecret');

// Used for testing an API call with aquired token and secret
const protectedResourceUrl = 'https://api.tumblr.com/v2/blog/developers.tumblr.com/info';

// Tumblr endpoints
const authorizeUrl = 'https://www.tumblr.com/oauth/authorize';
const requestTokenUrl = 'https://www.tumblr.com/oauth/request_token';
const accessTokenUrl = 'https://www.tumblr.com/oauth/access_token';

// OAuth(requestTokenUrl, accessTokenUrl, consumerKey, consumerSecret, OAuthVersion, callbackUrl, digest)
const oa = new OAuth(
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

      let authUrl = authorizeUrl + '?oauth_token=' + token;
      api.sendMessage(authUrl, threadID);
    });
}

module.exports = {
  trigger: trigger
}
