var Forecast = require('forecast');
var NodeGeocoder = require('node-geocoder');
var moment = require('moment');
var geocoder = NodeGeocoder({
  provider: 'locationiq',
  apiKey: '2ce1700616751d',
});

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
    var threadID = message.threadId;
    message = message.message;
    city = city ? city : 'San Francisco';
    var args = city.split(",");
    var sendCity = args[0] ? args[0] : city;
    geocoder.geocode(sendCity.trim(), function(err, res) {
        if (res === undefined || res.length == 0) { return console.error("could not geocode"); }
        forecast.get([res[0]['latitude'], res[0]['longitude']], function(err, weather) {
            console.log(message)
            var response = "";
            if (err) return console.dir(err);
            if (args[1] == null) {
                var weatherEmoji = getEmoji(weather['currently']['icon']);
                response = weatherEmoji + " Currently " + Math.floor(weather['currently']['temperature']) + "°F, and " + weather['currently']['summary'].toLowerCase() + ". " + weather['daily']['data'][0]['summary'];
                if(weather['currently']['temperature'] > 70) {
                    var num = (weather['currently']['humidity']*100) + "%";
                    response += " Humidity: " + num;
                }
            } else if (args[1].trim() === 'daily') {
                var weatherEmoji;
                weather['daily']['data'].forEach(function(day) {
                    response += moment.unix(day['time']).format("dddd") + ": " + getEmoji(day['icon']) + " " + day['summary'] + "\n\n";
                });
            } else if (args[1].trim() == 'tomorrow') {
                var day = weather['daily']['data'][1];
                var weatherEmoji = getEmoji(day['icon']);
                response += weatherEmoji + " " + day['summary'];
            } else {
                response = "Couldn't find weather :/";
            }
             api.sendMessage(threadID, response);
        });
    });
}

module.exports = {
    trigger: trigger
}