var modules = require('../modules.json');

function trigger(args, api, message) {
  var threadID = message.threadId;
  body = message.message;
  var helpMessage;
  if(body.length > 1) {
    helpMessage = formDesc(body);
  } else {
    helpMessage = formHelp();
  }
  api.sendMessage(threadID, helpMessage);
}

function formHelp() {
  var usageMessage = '```\nusage: [/command] [<args>]\nSuch as "/echo hello world"\nTo see a list of valid commands, send /help commands';
  return usageMessage;
}

function formHelpCommands() {

  var usageMessage = "```\nDescription   Command\n----------------------\n";

  for(var module in modules) {
    usageMessage += modules[module].name;
    usageMessage += ' '.repeat(15-modules[module].name.length);
    usageMessage += '[' + modules[module].trigger + ']';
    usageMessage += '\n';
  }
  usageMessage += "/help <command> lists available subcommands and descriptions" 
  return usageMessage;
}

function formDesc(cmd) {
  if(cmd == "commands") {
    return formHelpCommands();
  }
  for(var module in modules) {
    if(cmd == modules[module].name) {
      var usageMessage = '```\n' + modules[module].name + ': ';
      usageMessage += modules[module].description + '\n';
      if(Object.keys(modules[module].usage).length > 0) {
        usageMessage += 'Commands begin with /' + modules[module].trigger + ':\n';
        for(var key in modules[module].usage) {
            usageMessage += key + ' - ';
            usageMessage += modules[module].usage[key] + '\n';
        }
      }
      usageMessage += '```';
    }
  }
  return usageMessage;
}

module.exports = {
  trigger: trigger
}
