var firebase = require('../firebase.js')

function trigger(message, api, messageObj) {
    sender = messageObj.senderID;
    threadID = messageObj.threadID;
    var arr = [];
    if(!isNormalInteger(message)) { console.error("bad input"); return; }
    firebase(function(db) {
        var firebaseDB = db.ref(threadID);
        firebaseDB.once("value")
            .then(function(snapshot) {
                if (snapshot.hasChild("poll")) {
                    var i = 1;
                    var arr = [];
                    snapshot.child("poll/option").forEach(function(option) {
                        arr[i] = option.val();
                        i++;
                    });
                    if(message > arr.length-1) {
                        console.err("invalid option");
                    } else {
                        firebaseDB.child("poll/responses/" + sender).set({vote: message-1});
                    }
                }
            });
    });
}

// Is string a positive number?
function isNormalInteger(str) {
    var n = ~~Number(str);
    return String(n) === str && n > 0;
}

module.exports = {
    trigger: trigger
}
