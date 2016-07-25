var summaryTool = require('node-summary');
var extractor = require('unfluff');
var superagent = require('superagent');

function trigger(message, api, messageObj) {
    threadID = messageObj.threadID;
    api.sendTypingIndicator(threadID, function() {});
    superagent
        .get(message)
        .end(function(err, res) {
            var extracted = extractor.lazy(res.text, 'en');
            var title = extracted.title();
            var content = extracted.text();
            summaryTool.summarize(title, content, function(err, summary) {
                if (err) console.log("Something went wrong.");
                console.log("Original Length " + (title.length + content.length));
                console.log("Summary Length " + summary.length);
                console.log("Summary Ratio: " + (100 - (100 * (summary.length / (title.length + content.length)))));
                api.sendMessage(summary, threadID);
            });
        });
}

module.exports = {
    trigger: trigger
}
