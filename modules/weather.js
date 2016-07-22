var Forecast = require('forecast');
var NodeGeocoder = require('node-geocoder');
var options = { provider:'google' };
var geocoder = NodeGeocoder(options);
var forecast = new Forecast({
  service:'forecast.io',
  key:process.env.FORECAST_IO_KEY,
  units:'f', // Only the first letter is parsed
  cache:true, // Cache API requests?
  ttl: { // How long to cache requests, Uses syntax from moment.js 
         // http://momentjs.com/docs/#/durations/creating/
    minutes: 27,
    seconds: 45
  }
});

function trigger(city, threadID, api) { 
  geocoder.geocode(city, function(err, res) {
	  forecast.get([res[0]['latitude'], res[0]['longitude']], function(err, weather) {
		  if(err) return console.dir(err);
		  api.sendMessage(res[0]['city'] + " Weather: Currently " 
        + Math.floor(weather['currently']['temperature']) + ", and "
        + weather['currently']['summary'], threadID);
    });
  });
}

module.exports = {
  trigger: trigger
}
