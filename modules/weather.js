var Forecast = require('forecast');
var NodeGeocoder = require('node-geocoder');
var moment = require('moment');
var options = { provider:'google' };
var geocoder = NodeGeocoder(options);
var forecast = new Forecast({
  service: 'forecast.io',
  key: process.env.FORECAST_IO_KEY,
  units: 'f',
  cache: true,
  ttl: {
    minutes: 30
  }
});

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
	  	response = "Currently " + Math.floor(weather['currently']['temperature']) + "°F, and "
          + weather['currently']['summary'].toLowerCase() + ". " + weather['daily']['data'][0]['summary'];
	  }
      api.sendMessage(response, threadID);
    });
  });
}

module.exports = {
  trigger: trigger
}
