const modules = require('../modules.json');

function trigger(message, api, messageObj) {
  const threadID = messageObj.threadId;
  body = message;
  let helpMessage;
  if (body.length > 1) {
    helpMessage = formDesc(body);
  } else {
    helpMessage = formHelp();
  }
  api.sendMessage(threadID, helpMessage);
}

function formHelp() {
  const usageMessage =
    '```\nusage: [/command] [<args>]\nSuch as "/echo hello world"\nTo see a list of valid commands, send /help commands';
  return usageMessage;
}

function formHelpCommands() {
  let usageMessage = '```\nDescription   Command\n----------------------\n';

  for (const module in modules) {
    usageMessage += modules[module].name;
    usageMessage += ' '.repeat(15 - modules[module].name.length);
    usageMessage += `[${modules[module].trigger}]`;
    usageMessage += '\n';
  }
  usageMessage += '/help <command> lists available subcommands and descriptions';
  return usageMessage;
}

function formDesc(cmd) {
  if (cmd == 'commands') {
    return formHelpCommands();
  }
  for (const module in modules) {
    if (cmd == modules[module].name) {
      var usageMessage = `\`\`\`\n${modules[module].name}: `;
      usageMessage += `${modules[module].description}\n`;
      if (Object.keys(modules[module].usage).length > 0) {
        usageMessage += `Commands begin with /${modules[module].trigger}:\n`;
        for (const key in modules[module].usage) {
          usageMessage += `${key} - `;
          usageMessage += `${modules[module].usage[key]}\n`;
        }
      }
      usageMessage += '```';
    }
  }
  return usageMessage;
}

module.exports = {
  trigger
};