'use strict';

const stompit = require('stompit');
var moment = require('moment');
var uuid = require('node-uuid');
var Redis = require('ioredis');


var redis = new Redis();
var pipeline = redis.pipeline();

var record = {};

var batchCounter = 0;
//var x = "";

stompit.connect({ host: 'localhost', port: 61613 }, function(err1, client) {
	if(err1){
		console.log('connection error : ' + err1.message);
		return;
	}
    client.subscribe({ destination: 'MyQueue' }, function(err2, msg) {
    	if (err2){
    		console.log('subscribe error : ' + err2.message);
    		return;
    	}
        msg.readString('UTF-8', function(err3, body) {
        	if(err3){
        		console.log('readString error : ' + err3.message);
        		return;
        	}

            if (batchCounter >= 20){

                pipeline.exec(function(err4, results) {
                    if (err4) {
                        console.log("pipeline error : " + err4.message);
                    }
                    pipeline = redis.pipeline();
                    batchCounter = 0;
                    //console.log('success');
                    console.log(results);
                });
            }
        	//console.log('recieved');
        	//console.log(body);

            record = JSON.parse(body);
    		record.redis_timestamp = moment().format('YYY-MM-DDTHH:mm:ss.SSS');
        	batchCounter++;
            //x = uuid.v1();
            //console.log('idddddddddddddddddd : ' + x);
            //pipeline.set(x, JSON.stringify(record));
            pipeline.set(uuid.v1(), JSON.stringify(record));

            //client.disconnect();
          });
      });
  });