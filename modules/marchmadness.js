var cheerio = require('cheerio');
var superagent = require('superagent');

function trigger(message, api, messageObj) {
  var threadID = messageObj.threadID;
  var options = message.split(" ");
  var end = api.sendTypingIndicator(threadID, function() {
    superagent
      .get("http://www.cbssports.com/college-basketball/scoreboard")
      .end(function(err, res) {
        if (err || !res.ok) {
          console.error("Error getting ESPN HTML");
        } else {
          $ = cheerio.load(res.text);
          if(options[0] === '') {
            var string = "";
            $('.single-score-card').each(function(i, elm) {
              if($(this).find('.team').find('a').first().length > 0) {
                var broadcaster = "CBS"; // Default case
                var time = "";
                var live = false;
                var finished = false;

                // If broadcaster is not CBS
                if($(this).find('.broadcaster').children().length == 1) {
                  var broadcaster = $(this).find('.broadcaster').text().trim().replace(/ /g,'').substring(10);
                }
                if($(this).find('.game-status').find('.pregame-date').length == 1) { // Before the game
                  time = " @ " + $(this).find('.game-status').find('.pregame-date').text().trim() 
                        + " on " + broadcaster + "\n";
                } else if($(this).find('.emphasis').length == 1) { // During the game
                  live = true;
                  time = " - " + $(this).find('.emphasis').text().trim() + " - on " + broadcaster + "\n";
                } else if($(this).find('.postgame').length == 1) { // Game has finished
                  finished = true;
                  time = "\n";
                }
                if(finished) {
                  var score_team_one = $(this).find('tr').find('td').eq(3).text();
                  var score_team_two = $(this).find('tr').find('td').eq(7).text();
                  if(parseInt(score_team_one) > parseInt(score_team_two)) {
                    string += "✅ " + $(this).find('.team').find('a').first().text().trim().toUpperCase();
                    string += " vs " + $(this).find('.team').find('a').last().text().trim();
                  } else {
                    string += "✅ " + $(this).find('.team').find('a').last().text().trim().toUpperCase();
                    string += " vs " + $(this).find('.team').find('a').first().text().trim();
                  }
                } else {
                  if(live) {
                    string += "👉 ";
                  } else {
                    string += "⏳ ";
                  }
                  string += $(this).find('.team').find('a').first().text().trim();
                  string += " vs " + $(this).find('.team').find('a').last().text().trim();
                }
                string += time;
              }
            });
          } else if(options[0] === "live") {
            var string = "";
            $('.ingame').each(function(i, elm) {
              var status = $(this).find('.emphasis').text().trim();
              var score_team_one = $(this).find('tr').find('td').eq(3).text()
              var score_team_two = $(this).find('tr').find('td').eq(7).text()
              string += $(this).find('.team').find('a').first().text().trim() + " ("+score_team_one+")";
              string += " vs " + $(this).find('.team').find('a').last().text().trim() +" ("+score_team_two+")";
              string += " - " + status + "\n";
            });
            if(string === "") {
              string += "No live games right now 😢";
            }
          }
          api.sendMessage(string, threadID);
        }
        end();
    });
  });
}

module.exports = {
  trigger: trigger
}
