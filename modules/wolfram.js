var superagent = require('superagent');
var Client = require('node-wolfram');
var config = require('config');
var Wolfram = new Client(config.get('wolframAPI'));

function trigger(search, api, messageObj) {
    var threadID = messageObj.threadID;
    var end = api.sendTypingIndicator(threadID, function() {
      Wolfram.query(search, function(err, result) {
        if(err)
          console.log(err);
        else {
          for(var a=0; a<result.queryresult.pod.length; a++) {
            var pod = result.queryresult.pod[a];
            if(pod.$.title == 'Result' || pod.$.title == 'Definition' || pod.$.title == 'Definite integral') {
            console.log(pod.$.title,": ");
            for(var b=0; b<pod.subpod.length; b++)
            {
                var subpod = pod.subpod[b];
                for(var c=0; c<subpod.plaintext.length; c++)
                {
                    var text = subpod.plaintext[c];
                    api.sendMessage(text, threadID);
                    console.log('\t', text);
                    return;
                }
            }
          }
        }
    }
});
      
      end();
    });
}

module.exports = {
    trigger: trigger
}