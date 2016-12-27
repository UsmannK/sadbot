var tumblr = require('tumblr.js');
var firebase = require('../firebase.js');
var config = require('config');
var appConsumerKey = config.get('tumblr.consumerKey');
var appConsumerSecret = config.get('tumblr.consumerSecret');

function trigger(message, api, messageObj) {
  var args = message.split(" ");
  threadID = messageObj.threadID;
  if (args[0] === 'auth') {
    api.sendMessage('http://127.0.0.1:3000?user=' + messageObj.senderID, threadID);
  } else {
    var client;
    firebase(function(db) {
      var firebaseDB = db.ref('oauth/tumblr');
      firebaseDB.once("value").then(function(snapshot) {
        if (snapshot.hasChild(messageObj.senderID)) {
          client = tumblr.createClient({
            consumer_key: appConsumerKey,
            consumer_secret: appConsumerSecret,
            token: snapshot.child(messageObj.senderID + '/token').val(),
            token_secret: snapshot.child(messageObj.senderID + '/secret').val()
          });
          if(args[0] === 'list') {
            var list = '';
            client.userInfo(function(err, data) {
              data.user.blogs.forEach(function(blog) {
                list += blog.name + '\n';
              });
              api.sendMessage(list, threadID);
            });
          } else if (args[0] === 'set' && args[1] != null) {
            firebaseDB.child(messageObj.senderID).child("blog").set(args[1]);
          } else if (args[0] === 'post' && args[1] === 'text' && args[2] !== null) {
            client.createTextPost(snapshot.child(messageObj.senderID).child("blog").val(), {body: args[2]}, function() {
              api.sendMessage('Text post created', threadID);
            });
          }
        };
      });
    });
  }
}

module.exports = {
  trigger: trigger
}
