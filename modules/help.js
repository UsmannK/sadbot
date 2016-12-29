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
    usageMessage += '\n';
  }
  usageMessage += "help <command> lists available subcommands and descriptions" 
  return usageMessage;
}

function formDesc(cmd) {
  for(var module in modules) {
    if(cmd == modules[module].name) {
      var usageMessage = '```\n' + modules[module].name + ': ';
      usageMessage += modules[module].description + '\n';
      if(Object.keys(modules[module].usage).length > 0) {
        usageMessage += 'Commands begin with /' + modules[module].trigger + ':\n';
        for(var key in modules[module].usage) {
            usageMessage += key + ' - ';
            usageMessage += modules[module].usage[key] + '\n';
            console.log(key);
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
