var express = require('express');
var router = new express.Router();
var OAuth = require('oauth').OAuth;
var config = require('config');
var util = require('util');
var firebase = require('../firebase.js');
var appConsumerKey = config.get('tumblr.consumerKey');
var appConsumerSecret = config.get('tumblr.consumerSecret');

// Used for testing an API call with aquired token and secret
var protectedResourceUrl = 'https://api.tumblr.com/v2/blog/developers.tumblr.com/info';

// Tumblr endpoints
var authorizeUrl = 'https://www.tumblr.com/oauth/authorize';
var requestTokenUrl = 'https://www.tumblr.com/oauth/request_token';
var accessTokenUrl = 'https://www.tumblr.com/oauth/access_token';

var oa = new OAuth(
  requestTokenUrl,
  accessTokenUrl,
  appConsumerKey,
  appConsumerSecret,
  '1.0A',
  config.get('tumblr.callback_base') + '/callback',
  'HMAC-SHA1'
);

var reqToken;
var reqTokenSecret;
var user;
router.get('/', function (req, res, next) {
  oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
    user = req.query.user;
    console.log(user);
    console.log('\ttoken %s | secret %s', oauth_token, oauth_token_secret);
    reqToken = oauth_token;
    reqTokenSecret = oauth_token_secret;
    var authUrl = authorizeUrl + '?oauth_token=' + oauth_token;
    var html = '<a href='+authUrl+'>'+authUrl+'</a>';
    return res.status(200).send(html);
  });
});

router.get('/callback', function (req, res, next) {
  console.log(reqToken);
  console.log(reqTokenSecret);
  oa.getOAuthAccessToken(
    req.query.oauth_token,
    reqTokenSecret,
    req.query.oauth_verifier,
    function (err, token, secret) {
      testOAuthToken(user, token, secret);
    }
  );

  function testOAuthToken(user, token, secret) {
    console.log(user);
    firebase(function(db) {
      db.ref('oauth/tumblr').child(user).set({
        token: token,
        secret: secret
      });
    });
    console.log('Test accessToken', protectedResourceUrl);
    oa.get(protectedResourceUrl, token, secret, function (err) {
      if (err) {
        console.error('\tFailed with error', err);
        return next('Error testing OAuthToken');
      }

      console.log('\tVerification successful!');
      return res.send(util.format('<strong>Authorization successful!</strong><br>token: %s<br>secret: %s', token, secret));
    });
  }
});

module.exports = router;
