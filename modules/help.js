var modules = require('../modules.json');

function trigger(body, api, message) {
  var threadID = message.threadID;
  var helpMessage;
  if(body.length > 1) {
    helpMessage = formDesc(body);
  } else {
    helpMessage = formHelp();
  }
  api.sendMessage(helpMessage, threadID);
}

function formHelp() {
  var usageMessage = '```\nusage: [prefix|/][command] [<args>]\n\n'; 
  for(var module in modules) {
    usageMessage += modules[module].name;
    usageMessage += ' '.repeat(15-modules[module].name.length);
    usageMessage += '[' + modules[module].trigger + ']';
    usageMessage += '\n\n';
  }
  usageMessage += "help <command> lists available subcommands and descriptions" 
  return usageMessage;
}

function formDesc(cmd) {
console.log(cmd);
  for(var module in modules) {
    if(cmd == modules[module].name) {
      var usageMessage = modules[module].name;
      usageMessage += ' '.repeat(15-modules[module].name.length);
      usageMessage += '[' + modules[module].trigger + ']';
      usageMessage += '\n';
      usageMessage += modules[module].description;
    }
  }
  return usageMessage;
}

module.exports = {
  trigger: trigger
}
