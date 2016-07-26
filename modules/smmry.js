var summaryTool = require('node-summary');
var extractor = require('unfluff');
var superagent = require('superagent');
var config = require('config');

function trigger(message, api, messageObj) {
    threadID = messageObj.threadID;
    api.sendTypingIndicator(threadID, function() {});
    superagent
        .get(message)
        .end(function(err, res) {
            // Lazy extract text from HTML response
            var extracted = extractor.lazy(res.text, 'en');
            var title = extracted.title();
            var content = extracted.text();
            if(err) {console.error("could not get content"); return;}
            // Make request ot api.smmry
            superagent
                .post("http://api.smmry.com/&SM_API_KEY=" + config.get('smmryKey') + "&SM_LENGTH=3&SM_WITH_BREAK")
                .set('Expect', '')
                .set('Accept', 'application/json')
                .send('sm_api_input=' + content)
                .end(function(err, res) {
                    // If the API limit has been reached, used local summarization
                    if (res.body['sm_api_content'] && res.body['sm_api_content'] == 2) {
                        summaryTool.summarize(title, content, function(err, summary) {
                            if (err) console.log("Something went wrong.");
                            // console.log("Original Length " + (title.length + content.length));
                            // console.log("Summary Length " + summary.length);
                            // console.log("Summary Ratio: " + (100 - (100 * (summary.length / (title.length + content.length)))));
                            api.sendMessage(summary, threadID);
                        });
                    } else {
                        api.sendMessage(res.body['sm_api_content'].replaceAll("[BREAK]", "\n"), threadID);
                    }
                });
        });
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

module.exports = {
    trigger: trigger
}
