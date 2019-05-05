/**
 *  Name: TV
 *  Description: Gets information about a TV show
 *  Usage: /tv <show name>
 */

const superagent = require('superagent');
const moment = require('moment-timezone');

function trigger(search, api, message) {
  const shorthand = {
    got: 'Game of Thrones'
  };
  const query = shorthand[search.toLowerCase()] || search || 'Game of Thrones';
  superagent
    .get('http://api.tvmaze.com/singlesearch/shows')
    .query({ q: query })
    .end(function(err, res) {
      if (err || !res.ok) {
        console.error('Error getting TV show: %o', err);
      } else {
        const show = res.body;
        let response = `*${show.name}* (${show.status})`;
        if (show.status === 'Running') {
          let timezone = '';
          let name = '';
          let formattedTime = '';
          if (show.network) {
            timezone = show.network.country.timezone;
            name = show.network.name;
          } else {
            timezone = show.webChannel.country.timezone;
            name = show.webChannel.name;
          }
          if (show.schedule.time) {
            const scheduledTime = moment.tz(show.schedule.time, 'HH:mm', timezone);
            formattedTime = `at ${scheduledTime.tz('America/Los_Angeles').format('h:mm a z')} `;
          }
          response += `\nNext episode airs on ${show.schedule.days[0]} ${formattedTime}on ${name}`;
          api.sendMessage(message.threadId, response);
        } else if (show.status === 'Ended') {
          superagent
            .get(show._links.previousepisode.href)
            .end(function(prevEpisodeErr, prevEpisodeRes) {
              if (prevEpisodeErr || !prevEpisodeRes.ok) {
                console.error('Error getting TV show: %o', prevEpisodeErr);
              } else {
                const episode = prevEpisodeRes.body;
                const airDate = moment(episode.airdate, 'YYYY-MM-DD').format('MMMM Do, YYYY');
                response += `\nThe last episode (${episode.name}) aired on ${airDate}`;
                api.sendMessage(message.threadId, response);
              }
            });
        }
      }
    });
}

module.exports = {
  trigger
};
