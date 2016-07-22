function trigger(title, api, message) { 
  var threadID = message.threadID;
  api.setTitle(title, threadID, function(err, obj) {
    if(err) return console.error(err);
  });
}

module.exports = {
  trigger: trigger
}
