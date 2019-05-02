// start up scheduled tasks
require('./cronjobs.js');

// load config
var config = require('config');

// load webserver
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// load module definitions
var commandDescriptions = require('./modules.json');

var prefixLen = 1;

// return module that handles a command
var commands = commandDescriptions .map(function(cmd) {
  return require('./' + cmd['path']);
});

const { login } = require('libfb');

// (async() => {
// const api = await login('rob@kedarv.com', 'testingx1');


//   console.log('Got a message!')
//   console.log(message.message)
//   api.sendMessage(message.threadId, message.message)


// // login to the bot account
// login({email: config.get('botUsername'), password: config.get('botPassword')}, loginCallback);

// parse messages for handling

(async() => {
  const api = await login('rob@kedarv.com', 'testingx1');
  api.on('message', message => {
    message_text = message.message;
    if(isCommand(message_text)) {
      var commandString = message_text.slice(prefixLen);
      var trigger = commandString.substring(0, endOfCmd(commandString));
      commands.forEach(function(cmd, index) {
        if(trigger == commandDescriptions[index]['trigger']) {
          const args = commandString.slice(trigger.length+1) || '';
          cmd.trigger(args, api, message);
        }
      });
    }
  });
})();

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
  if (!(message)) {
    return false;
  } else if (config.get('usePrefix')) {
    prefixLen = config.get('botPrefix').length + 1;
    return message.startsWith(config.get('botPrefix'));
  } else {
    return message.startsWith('/');
  }
}
