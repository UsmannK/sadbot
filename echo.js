var login = require("facebook-chat-api");

// Load enviornment data
require('dotenv').config();

// Create simple echo bot
login({email: process.env.BOT_USERNAME, password: process.env.BOT_PASSWORD}, function callback (err, api) {
  if(err) return console.error(err);
  api.listen(function callback(err, message) {
    if(typeof message.body == "string" && message.body.startsWith("@"+process.env.BOT_PREFIX+" echo")) {
      api.sendMessage(message.body.slice(13), message.threadID);
    }
  });
});
