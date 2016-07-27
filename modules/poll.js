var firebase = require('../firebase.js')

function trigger(message, api, messageObj) {
    threadID = messageObj.threadID;
    var args = message.split(" ");

    firebase(function(db) {
        var firebaseDB = db.ref(threadID);
        if (args[0] === 'create' && args[1] != null) {
            firebaseDB.once("value")
                .then(function(snapshot) {
                    if (snapshot.hasChild("poll")) {
                        console.error("poll already exists");
                    } else {
                        var string = "";
                        for (var i = 1; i < args.length; i++) {
                            string += args[i] + " ";
                        }
                        firebaseDB.child("poll").child("question").set(string.slice(0, -1));
                    }
                });
        } else if (args[0] === 'add') {
            firebaseDB.once("value")
                .then(function(snapshot) {
                    if (snapshot.hasChild("poll")) {
                        if (args[1] && args[1] === 'decide') {
                            firebaseDB.child("poll").child("option").push("Yes");
                            firebaseDB.child("poll").child("option").push("No");
                        } else {
                            var string = "";
                            for (var i = 1; i < args.length; i++) {
                                string += args[i] + " ";
                            }
                        }
                        firebaseDB.child("poll").child("option").push(string.slice(0, -1));
                    } else {
                        console.error("err: poll does not exist");
                    }
                });
        } else if (args[0] === 'delete') {
            firebaseDB.once("value")
                .then(function(snapshot) {
                    if (snapshot.hasChild("poll")) {
                        firebaseDB.child("poll").remove();
                    } else {
                        console.error("err: poll does not exist");
                    }
                });
        } else if (args[0] === 'view') {
            firebaseDB.once("value")
                .then(function(snapshot) {
                    var options = [];
                    var votes = [];
                    var string = "";
                    if (snapshot.hasChild("poll")) {
                        string = snapshot.child("poll/question").val() + "\n";
                        snapshot.child("poll/option").forEach(function(option) {
                            options.push(option.val());
                        });
                        snapshot.child("poll/responses").forEach(function(option) {
                            if (typeof votes[option.val()['vote']] === 'undefined') {
                                votes[option.val()['vote']] = 1;
                            } else {
                                votes[option.val()['vote']]++;
                            }
                        });
                        for (var i = 0; i < options.length; i++) {
                            if (votes[i] === undefined) { votes[i] = 0; }
                            string += "#" + (i + 1) + ": " + options[i] + " (" + votes[i] + ")\n";
                        }
                    } else {
                        string = "poll does not exist";
                    }
                    api.sendMessage(string, threadID);
                });
        }
    });
}

module.exports = {
    trigger: trigger
}
