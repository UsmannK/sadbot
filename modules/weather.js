var Forecast = require('forecast');
var NodeGeocoder = require('node-geocoder');
var moment = require('moment');
var options = { provider:'google' };
var geocoder = NodeGeocoder(options);
var config = require('config');
var forecast = new Forecast({
  service: 'forecast.io',
  key: config.get('forecastIoKey'),
  units: 'f',
  cache: true,
  ttl: {
    minutes: 30
  }
});
var weatherEmojis = {
  'clear-day': '☀️',
  'clear-night': '🌚',
  'rain': '🌧',
  'snow': '❄️',
  'sleet': '🌨',
  'wind': '💨',
  'fog': '🌫',
  'cloudy': '☁️',
  'partly-cloudy-day': '🌤',
  'partly-cloudy-night': '☁️'
};

function getEmoji(weather) {
  return weatherEmojis[weather] ? weatherEmojis[weather] : '';
}

function trigger(city, api, message) { 
  var args = message.body.split(" ");
  threadID = message.threadID;
  geocoder.geocode(city, function(err, res) {
    forecast.get([res[0]['latitude'], res[0]['longitude']], function(err, weather) {
      var response = "";
	  if(err) return console.dir(err);

	  if(args[3] === 'daily') {
        weather['daily']['data'].forEach(function(day) {
        	response += moment.unix(day['time']).format("dddd") + ": " + day['summary'] + "\n";
        });
	  } else {
      var weatherEmoji = getEmoji(weather['currently']['icon']);
	  	response = weatherEmoji + " Currently " + Math.floor(weather['currently']['temperature']) + "°F, and "
          + weather['currently']['summary'].toLowerCase() + ". " + weather['daily']['data'][0]['summary'];
	  }
      api.sendMessage(response, threadID);
    });
  });
}

module.exports = {
  trigger: trigger
}
