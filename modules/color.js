var Color = require('color');

const INVALID = 'INVALID';
var list = '```\nBuilt-in colors:\n\n';
var currColor;
var colors = {
  'red': '#ff3b30',
  'orange': '#ff9500',
  'yellow': '#ffcc00',
  'green': '#4cd964',
  'teal': '#47778d',
  'blue': '#007aff',
  'purple': '#5856d6',
  'pink': '#ff2d55',
  'grey': '#95a5a6',
  'white': '#95a5a6',
  'black': '#333333',
  'mango': '#FF7056',
  'rose gold': '#e0929e',
  'space grey': '#4f5b66',
  'gold': '#D9B650'
};

function getRN() {
  return Math.floor(Math.random() * 256);
}

function handleColor(color, threadID, api) {
  if (color == 'list') {
    for (var c in colors) {
      list = list + c + ' '.repeat(15-c.length) + colors[c].toUpperCase() + '\n';
    }

    api.sendMessage(list, threadID);
    return INVALID;
  } else if((color == '++') || (color == 'lighter') || (color == 'lighten')) {
    return Color(currColor).lighten(0.20).hexString();
  } else if((color == '--') || (color == 'darker') || (color == 'darken')) {
    return Color(currColor).darken(0.20).hexString();
  } else if ((color == 'random')) {
    return Color().rgb(getRN(),getRN(),getRN()).hexString();
  }

  // Get color from color object
  if (colors[color]) return colors[color];
  
  // No valid color -- sadboi
  return INVALID;
}

function trigger(color, api, message) {
  // Get threadID from message object
  var threadID = message.threadID;

  api.getThreadInfo(threadID, function(err, info) {
    if (err) return console.log(err);
    currColor = info['color'];
    // 7 is length of valid hex #XXXXXX
    if (!color.startsWith('#') || color.length != 7) {
      color = handleColor(color.toLowerCase(), threadID, api);
    }
    if (color && (color != INVALID)) {
      api.changeThreadColor(color, threadID, function(err) {
        if (err) return console.error(err);
      });
    }
  });
}

module.exports = {
  trigger: trigger
}
