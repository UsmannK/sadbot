var queue = require('kue').createQueue();
var config = require('config');
var login = require('facebook-chat-api');
// login to the bot account
login({email: config.get('botUsername'), password: config.get('botPassword')}, loginCallback);
function loginCallback(err, api) {
  	if(err) return console.error(err);

	queue.process('send-message', function(job, done){
		sendmessage(job.data.body, job.data.thread_id, api, done);
	});

	function sendmessage(message, threadID, api, done) {
	  //   return done(new Error('something'));
	  api.sendMessage('[from queue] '+message, threadID);
	  done();
	}
}



