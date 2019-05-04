// load config
const config = require('config');
const { login } = require('libfb');

// load module definitions
const commandDescriptions = require('./modules.json');

const prefixLen = 1;

// return module that handles a command
const commands = commandDescriptions.map(function(cmd) {
  return require(`./${cmd.path}`);
});

const freeformTriggers = ['thanks robby', 'thanks sadbot', 'thanks bot'];
const thanks = [
  'you got it!',
  "you're welcome friendo",
  '_beep boop_',
  '_<3_',
  'cheers 🍻',
  'np bud'
];

// parse messages for handling
(async () => {
  const api = await login(config.get('botUsername'), config.get('botPassword'));
  api.on('message', message => {
    if (isCommand(message.message)) {
      const commandString = message.message.slice(prefixLen);
      const trigger = commandString.substring(0, endOfCmd(commandString));
      commands.forEach(function(cmd, index) {
        if (trigger === commandDescriptions[index].trigger) {
          const args = commandString.slice(trigger.length + 1) || '';
          cmd.trigger(args, api, message);
        }
      });
    } else if (freeformTriggers.some(word => message.message.includes(word))) {
      api.sendMessage(message.threadId, thanks[Math.floor(thanks.length * Math.random())]);
    }
  });
})();

// determine the end of the command
function endOfCmd(cmd) {
  if (cmd.indexOf(' ') > 0) {
    return cmd.indexOf(' ');
  }
  return cmd.length;
}

// determine if a received message is a command
function isCommand(message) {
  if (!message) {
    return false;
  }
  if (config.get('usePrefix')) {
    prefixLen = config.get('botPrefix').length + 1;
    return message.startsWith(config.get('botPrefix'));
  }
  return message.startsWith('/');
}
