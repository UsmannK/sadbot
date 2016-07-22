//Start up scheduled tasks
require('./cronjobs.js');
require('dotenv').config();
var login = require('facebook-chat-api');
var commandDescriptions = require('./modules.json');

var commands = commandDescriptions .map(function(cmd) {
  return require('./' + cmd['path']);
});

login({email: process.env.BOT_USERNAME, password: process.env.BOT_PASSWORD}, loginCallback);

function loginCallback(err, api) {
  if(err) return console.error(err);
  api.listen(function callback(err, message) {
    if(message && message.body && message.body.startsWith(process.env.BOT_PREFIX)) {
      var commandString = message.body.slice(process.env.BOT_PREFIX.length);
      var trigger = commandString.substring(0, commandString.indexOf(' '));
      commands.forEach(function(cmd, index) {
        if(trigger == commandDescriptions[index]['trigger']) {
          cmd.trigger(commandString.slice(trigger.length+1), message.threadID, api);
        }
      });
    }
  });
}

