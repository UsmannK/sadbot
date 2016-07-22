const INVALID = 'INVALID';
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

function handleColor(color, threadID, api) {
  if (color == 'list') {
    var list = 'Built-in colors:\n\n';
    for (var c in colors) {
      list = list + c + ': ' + colors[c] + '\n';
    }
    console.log(list);
    api.sendMessage(list, threadID);
    return INVALID;
  }
  // Get color from color object
  if (colors[color]) {
    return colors[color];
  }
  // #XXX hex format
  if (color.startsWith('#') && color.length == 4 && !isNaN(color.charAt(1))) {
    var colorCode = color.charAt(1).repeat(6);
    return '#' + colorCode;
  }
  // No valid color -- sadboi
  return INVALID;
}

function trigger(color, threadID, api) { 
  // 7 is length of valid hex #XXXXXX
  if (!color.startsWith('#') || color.length != 7) {
    color = handleColor(color.toLowerCase(), threadID, api);
  }
  if (color && color != INVALID) {
    api.changeThreadColor(color, threadID);
  }
}

module.exports = {
  trigger: trigger
}
