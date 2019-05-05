/**
 *  Name: Yelp
 *  Description: Gets business by search query
 *  Usage: /yelp <business name>
 */

const superagent = require('superagent');
const config = require('config');

function trigger(search, api, message) {
  const query = search || 'Japacurry';
  superagent
    .get('https://api.yelp.com/v3/businesses/search')
    .set('Authorization', `Bearer ${config.get('yelpKey')}`)
    .query({ term: query, location: 'San Francisco' })
    .end(function(err, res) {
      if (err || !res.ok) {
        console.error('Error getting Yelp Business: %o', err);
      } else {
        const biz = res.body.businesses[0];
        const response = `${biz.name} ${biz.rating}/5.0 [${biz.url.split('?')[0]}]`;
        api.sendMessage(message.threadId, response);
      }
    });
}

module.exports = {
  trigger
};
