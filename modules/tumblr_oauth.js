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
    var html = '<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">'
    + '<div class="container"><hr/><div class="panel panel-default"><div class="panel-body"><a href='+authUrl+'>Begin Tumblr Authorization Process &raquo;</a></div></div><hr/></div>';
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
    var html = '<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">'
    + '<div class="container"><hr/><div class="panel panel-success"><div class="panel-heading">'
    + '<h3 class="panel-title">Verification Successful</h3></div><div class="panel-body">Head back to sadbot, and run <pre>/tumblr list</pre>. To set the blog where things will get posted, run <pre>/tumblr set &lt;blogname&gt;</pre></div></div><hr/></div>';
    return res.status(200).send(html);
    });
  }
});

module.exports = router;
