var allEmojis = require("emojilib").lib;
var emojiRegex = require('emoji-regex');

// @TODO: Catch if emoji is invalid (not allowed on facebook)
function trigger(emoji, api, message) {
  var threadID = message.threadID;
  if(emojiRegex().test(emoji)) {
    api.changeThreadEmoji(emoji, threadID, function(err) {
      if (err) return console.error(err);
    });
  } else {
  	var findEmoji = getMeAnEmoji(emoji);
  	if(findEmoji) {
  	  api.changeThreadEmoji(findEmoji, threadID, function(err) {
        if (err) return console.error(err);
      });
    }
  }
}

// From https://github.com/notwaldorf/emoji-translate
function getMeAnEmoji(word) {
  word = word.trim().toLowerCase();

  if (!word || word === '' || word === 'it')
    return '';

  // Maybe this is a plural word but the word is the singular?
  // Don't do it for two letter words since "as" would become "a" etc.
  var maybeSingular = '';
  if (word.length > 2 && word[word.length - 1] == 's')
    maybeSingular = word.slice(0, word.length - 1);

  // Maybe this is a singular word but the word is the plural?
  // Don't do this for single letter since that will pluralize crazy things.
  var maybePlural = (word.length == 1) ? '' : word + 's';

  // Go through all the things and find the first one that matches.
  for (var emoji in allEmojis) {
    var words = allEmojis[emoji].keywords;
    if (emoji == word || emoji == maybeSingular || emoji == maybePlural ||
        (words && words.indexOf(word) >= 0) ||
        (words && words.indexOf(maybeSingular) >= 0) ||
        (words && words.indexOf(maybePlural) >= 0))
      return allEmojis[emoji].char;
  }
  return '';
};
module.exports = {
  trigger: trigger
}