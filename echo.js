var details = require("./details.json")
var login = require("facebook-chat-api");
var Forecast = require('forecast');
var forecast = new Forecast({
  service: 'forecast.io',
  key: '78526c408f187d3668e14c3e79aa6202',
  units: 'f', // Only the first letter is parsed 
  cache: true,      // Cache API requests? 
  ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/ 
    minutes: 27,
    seconds: 45
    }
});
var NodeGeocoder = require('node-geocoder');
var options = { provider: 'google' };
var geocoder = NodeGeocoder(options);

// Create simple echo bot
login({email: details["username"], password: details["password"]}, function callback (err, api) {
  if(err) return console.error(err);
  api.listen(function callback(err, message) {
    if(message && message.body && message.body.startsWith("@sadbot echo")) {
      api.sendMessage(message.body.slice(13), message.threadID);
    }
    else if(message && message.body && message.body.startsWith("@sadbot weather")) {
    	var city = message.body.slice(16);
    	if(city) {
    		geocoder.geocode(city, function(err, res) {
	    		forecast.get([res[0]['latitude'], res[0]['longitude']], function(err, weather) {
	  				if(err) return console.dir(err);
	  				api.sendMessage(res[0]['city'] + " Weather: Currently " + Math.floor(weather['currently']['temperature']) + ", and " + weather['currently']['summary'], message.threadID);
				});
			});
    	}
    	else {
    		api.sendMessage("Usage: @bot weather <city>", message.threadID);
    	}
    }
  });
});
