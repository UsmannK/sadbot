var superagent = require('superagent');

function trigger(search, api, messageObj) {
    var threadID = messageObj.threadID;
    var url = 'http://www.omdbapi.com/?t=' + search.replace(/ /g,"+") + '&y=&plot=short&r=json';
    var end = api.sendTypingIndicator(threadID, function() {
      superagent
        .get(url)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          if (err || !res.ok) {
            console.error("Error getting OMDb API results");
          } else {
            if(res.body && res.body['Response'] == 'False') {
              msg = res.body['Error']
            } else {
               var msg = {
                  body: res.body['Title'] + ' (' + res.body['Year'] + '), IMDb: ' + res.body['imdbRating'],
                  url: res.body['Poster']
                }
            }
            api.sendMessage(msg, threadID);
          }
          end();
      });
    });
}

module.exports = {
    trigger: trigger
}
