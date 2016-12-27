"use strict"; 
var express = require('express');
var router = new express.Router();
var util = require('util');
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
  'http://localhost:3000/callback',
  'HMAC-SHA1'
);

router.get('/', function (req, res, next) {
  console.log('getOAuthRequestToken');
  oa.getOAuthRequestToken(function (err, token, secret) {
    if (err) {
      console.error('\tFailed with error', err);
      return next(err);
    }
    console.log('\ttoken %s | secret %s', token, secret);

    // Save generated tokens to session
    req.session.requestToken = token;
    req.session.requestTokenSecret = secret;

    var authUrl = authorizeUrl + '?oauth_token=' + token;
    var html = util.format('<a href="%s">%s</a>', authUrl, authUrl);

    console.log('Direct client to authUrl');
    console.log('\t' + authUrl);
    console.log('\t... waiting for callback');

    return res.status(200).send(html);
  });
});

router.get('/callback', function (req, res, next) {
  console.log('Received callback');
  console.log('\toauth_token %s | oauth_verifier %s', req.query.oauth_token, req.query.oauth_verifier);
  console.log('\tsession token %s | session secret %s', req.session.requestToken, req.session.requestTokenSecret);

  if (!req.session.requestToken || !req.session.requestTokenSecret) {
    console.error('\tError: Missing session information');
    return next('No previous session info found');
  }

  console.log('getOAuthAccessToken');

  oa.getOAuthAccessToken(
    req.query.oauth_token,
    req.session.requestTokenSecret,
    req.query.oauth_verifier,
    function (err, token, secret) {
      if (err) {
        console.error('\tValidation failed with error', err);
        return next('getOAuthAccessToken failed');
      }
      console.log('\ttoken %s | secret %s', token, secret);

      testOAuthToken(token, secret);
    }
  );

  function testOAuthToken(token, secret) {
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
