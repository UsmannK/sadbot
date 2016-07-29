
var firebase = require('../firebase.js')

function trigger(command, api, message) {
  var option = command.substring(0, command.indexOf(' '));
  var setting = command.substring(command.indexOf(' ') + 1);
  console.log(option,"-",setting);
  var threadID = message.threadID;

  if(option == "save") { 
  	var key = setting.substring(0, setting.indexOf(' '));
  	var val = setting.substring(setting.indexOf(' ') + 1);
  	firebase(function(db) {
  	    var threadRef = db.ref(threadID);
        threadRef.child("snip").child(key).set({text: val});
  	});
  }
  else if(setting == "list") {
  	console.log('list');
  	firebase(function(db) {
        var threadRef = db.ref(threadID);
        var preferencesRef = threadRef.child('snip');
        preferencesRef.once('value', function(snap) {
          var vals = snap.val();
          string = "";
          for(key in vals) {
            string+=key+" - "+vals[key].text+"\n";
          }
          console.log(string);
          api.sendMessage(string, threadID);
        })
      })
  }
}

module.exports = {
  trigger: trigger
}
