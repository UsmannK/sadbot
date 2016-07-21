var details = require("./details.json")
var login = require("facebook-chat-api");

// Create simple echo bot
login({email: details["username"], password: details["password"]}, function callback (err, api) {
  if(err) return console.error(err);
  api.listen(function callback(err, message) {
    if(typeof message.body == "string" && message.body.startsWith("@sadbot echo")) {
      api.sendMessage(message.body.slice(13), message.threadID);
    }
  });
});
