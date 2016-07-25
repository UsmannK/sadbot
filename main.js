// start up scheduled tasks
require('./cronjobs.js');

// load env variables
require('dotenv').config({path: '.env'});;
var login = require('facebook-chat-api');

// load module definitions
var commandDescriptions = require('./modules.json');

var prefixLen = 1;

// return module that handles a command
var commands = commandDescriptions .map(function(cmd) {
  return require('./' + cmd['path']);
});

// login to the bot account
login({email: process.env.BOT_USERNAME, password: process.env.BOT_PASSWORD}, loginCallback);

// parse messages for handling
function loginCallback(err, api) {
  if(err) return console.error(err);
  api.listen(function callback(err, message) {
    if(message.threadID) {
      api.deleteThread(message.threadID);
    }
    if(isCommand(message)) {
      var commandString = message.body.slice(prefixLen);
      var trigger = commandString.substring(0, endOfCmd(commandString));
      commands.forEach(function(cmd, index) {
        if(trigger == commandDescriptions[index]['trigger']) {
          cmd.trigger(commandString.slice(trigger.length+1), api, message);
        }
      });
    }
  });
}


// determine the end of the command
function endOfCmd(cmd) {
  if(cmd.indexOf(' ') > 0) {
    return cmd.indexOf(' ');
  } else {
    return cmd.length;
  }
}

// determine if a received message is a command
function isCommand(message) {
  if(!(message && message.body)) {
    return false;
  } else if(process.env.USE_PREFIX == 'true') {
    prefixLen = process.env.BOT_PREFIX.length + 1;
    return message.body.startsWith(process.env.BOT_PREFIX);
  } else {
    return message.body.startsWith('/');
  }
}
