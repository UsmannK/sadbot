function trigger(message, threadID, api) {
  var spaceLoc = message.indexOf(' ');
  if(message.substring(0,spaceLoc) == 'echo') {
    api.sendMessage(message.slice(spaceLoc+1), threadID);
  }
}

module.exports = {
  trigger: trigger
}
