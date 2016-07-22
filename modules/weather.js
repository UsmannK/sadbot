var Forecast = require('forecast');
var NodeGeocoder = require('node-geocoder');
var options = { provider:'google' }l
var geocoder = NodeGeocoder(options);
var forecast = new Forecast({
  service:'forecast.io',
  key:'78526c408f187d3668e14c3e79aa6202',
  units:'f', // Only the first letter is parsed
  cache:true, // Cache API requests?
  ttl: { // How long to cache requests, Uses syntax from moment.js 
         // http://momentjs.com/docs/#/durations/creating/
    minutes: 27,
    seconds: 45
  }
});

function trigger(message, threadID, api) {
    
}
