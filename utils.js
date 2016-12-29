var queue = require('kue').createQueue();

function sendMessage(body, thread_id) {
	var job = queue.create('send-message', {
		title: thread_id+" | "+body,// special key for the kue UI
	    body: body,
	  	thread_id: thread_id
	}).save( function(err){
	   // if( !err ) console.log( job.id );
	   if(err) console.log(err);
	});
}

module.exports = {
    sendMessage: sendMessage
};