//Start up scheduled tasks
require('./cronjobs.js');
require('dotenv').config();
var login = require('facebook-chat-api');
var helpers = require('./helpers');
var commandDescriptions = require('./modules');

var commands = commandDescriptions.map(function(cmd) {
  return require('./' + cmd['path']);
}

login({email: process.env.BOT_USERNAME, password: process.env.BOT_PASSWORD}, loginCallback);

function loginCallback(err, api) {
  if(err) return console.error(err);
  api.listen(function callback(err, message) {
    if(message && message.body) {
      //TODO: Check if bot prefix is in message. Do keyword checking here.
      var commandString = message.body.slice(process.env.BOT_PREFIX.length() + 1);
      commands.forEach(function(cmd) {
        cmd.trigger(commandString, message.threadID, api);
      }
    }
  }
}

