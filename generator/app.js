'use strict';

var moment = require('moment');
var uuid = require('uuid/v1');
const stompit = require('stompit');
var schedule = require('node-schedule');

var obj = {
	account_id : '100',
	account_name : 'xxx',
	interface_id : 2,
	source_addr : 'xxxxxx',
	destination_addr : '9xxxxxx',
	coding : 2,
	text_length : 58,
	concatenation : 1,
	message_text : 'test message',
	UDH : '%05%00%03%8B%02%02',
	flash : 0,
	validaty_period : 1440,
	delivery_time : 1440,
	smpp_port : 2222,
	registered_delivery : 0,
	dlr_ip : 'xx.xx.xxx.xx',
	dlr_port : 201
}

let startTime = new Date(Date.now() + 1000);
let endTime = new Date(startTime.getTime() + 1800000);
var frame;
var i=0;

schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/1 * * * * *' }, function() {

	stompit.connect({ host: 'localhost', port: 61613 }, function(err, client) {
		if(err){
			console.log('connect error : ' + err.message);
			return;
		}

		for (i = 1 ; i <= 250 ; i++){
			obj.message_id = uuid();
			obj.sm_timestamp = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
			var frame = client.send({ destination: 'MyQueue', 'content-type' : 'application/json' });
			frame.write(JSON.stringify(obj));
			frame.end();
			sleep(4);
		}
		client.disconnect();
	});
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
