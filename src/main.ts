// load config
const config = require('config');
import { login, Message } from 'libfb';
import { Module, Command } from './types';

// load module definitions
import m from './modules.json';
const commandDescriptions = <Module[]>m;

let prefixLen = 1;

// return module that handles a command
const commands: Command[] = commandDescriptions.map(function(cmd) {
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
const run = async () => {
  const api = await login(config.get('botUsername'), config.get('botPassword'));
  api.on('message', (message: Message) => {
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
};

// determine the end of the command
function endOfCmd(cmd: string) {
  if (cmd.indexOf(' ') > 0) {
    return cmd.indexOf(' ');
  }
  return cmd.length;
}

// determine if a received message is a command
function isCommand(message: string) {
  if (!message) {
    return false;
  }
  if (config.get('usePrefix')) {
    prefixLen = config.get('botPrefix').length + 1;
    return message.startsWith(config.get('botPrefix'));
  }
  return message.startsWith('/');
}

run();
