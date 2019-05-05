const Forecast = require('forecast');
const NodeGeocoder = require('node-geocoder');
const moment = require('moment');

const geocoder = NodeGeocoder({
  provider: 'locationiq',
  apiKey: '2ce1700616751d'
});

const config = require('config');

const forecast = new Forecast({
  service: 'forecast.io',
  key: config.get('forecastIoKey'),
  units: 'f',
  cache: true,
  ttl: {
    minutes: 30
  }
});
const weatherEmojis = {
  'clear-day': '☀️',
  'clear-night': '🌚',
  rain: '🌧',
  snow: '❄️',
  sleet: '🌨',
  wind: '💨',
  fog: '🌫',
  cloudy: '☁️',
  'partly-cloudy-day': '🌤',
  'partly-cloudy-night': '☁️'
};

function getEmoji(weather) {
  return weatherEmojis[weather] ? weatherEmojis[weather] : '';
}

function trigger(command, api, message) {
  let extractedCity = command
    .replace('daily', '')
    .replace('tomorrow', '')
    .trim();
  extractedCity = extractedCity || 'San Francisco';
  const mode = command
    .trim()
    .split(' ')
    .splice(-1)[0]
    .toLowerCase();
  geocoder.geocode(extractedCity, function(err, res) {
    if (res === undefined || res.length == 0) {
      return console.error('could not geocode');
    }
    forecast.get([res[0].latitude, res[0].longitude], function(err, weather) {
      let response = '';
      if (err) return console.dir(err);
      if (mode === 'daily') {
        weather.daily.data.forEach(function(day) {
          response += `${moment.unix(day.time).format('dddd')}: ${getEmoji(day.icon)} ${
            day.summary
          }\n\n`;
        });
      } else if (mode == 'tomorrow') {
        const day = weather.daily.data[1];
        response += `${getEmoji(day.icon)} ${day.summary}`;
      } else {
        const weatherEmoji = getEmoji(weather.currently.icon);
        response = `${weatherEmoji} Currently ${Math.floor(
          weather.currently.temperature
        )}°F, and ${weather.currently.summary.toLowerCase()}. ${weather.daily.data[0].summary}`;
        if (weather.currently.temperature > 70) {
          const num = `${weather.currently.humidity * 100}%`;
          response += ` Humidity: ${num}`;
        }
      }
      api.sendMessage(message.threadId, response);
    });
  });
}

module.exports = {
  trigger
};
