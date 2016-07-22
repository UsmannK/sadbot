const INVALID = 'INVALID';
var colors = {
  red: '#ff3b30',
  orange: '#ff9500',
  yellow: '#ffcc00',
  green: '#4cd964',
  teal: '#47778d',
  blue: '#007aff',
  purple: '#5856d6',
  pink: '#ff2d55'
};

function handleColor(color) {
  if (colors[color]) {
    return colors[color];
  }
  // #XXX hex format
  if (color.startsWith('#') && color.length == 4 && !isNaN(color.charAt(1))) {
    var colorCode = color.charAt(1).repeat(6);
    return '#' + colorCode;
  }
  //no valid color -- sad
  return INVALID;
}

function trigger(color, threadID, api) { 
  //7 is length of valid hex #XXX
  if (!color.startsWith('#') || color.length != 7) {
    color = handleColor(color);
  }
  if (color && color != INVALID) {
    api.changeThreadColor(color, threadID, function() {
      return;
    });
  }
}

module.exports = {
  trigger: trigger
}