'use strict';

const stompit = require('stompit');
var redis = require('redis');
var moment = require('moment');
var uuid = require('node-uuid');

var recordArray = [];
var record = {};
var redisClient = redis.createClient(6379 , 'localhost'), batch;

redisClient.on('error', function(e){
	console.log('Error creating redis socket connection : ' + e);
});

batch = redisClient.batch();

var batchCounter = 0;
//var x = "";
//var y = [];

stompit.connect({ host: 'localhost', port: 61613 }, function(err, client) {
	if(err){
		console.log('connection error : ' + err.message);
		return;
	}
    client.subscribe({ destination: 'MyQueue' }, function(error, msg) {
    	if (error){
    		console.log('subscribe error : ' + error.message);
    		return;
    	}
        msg.readString('UTF-8', function(error2, body) {
        	if(error2){
        		console.log('readString error : ' + error2.message);
        		return;
        	}

        	recordArray = body.split('\n');
        	for (var i = 0, l = recordArray.length ; i < l ; i++){
        		if (recordArray[i] != ''){
        			record = JSON.parse(recordArray[i]);
        			record.redis_timestamp = moment().format('YYY-MM-DDTHH:mm:ss.SSS');
        		//	x = uuid.v1();
        		//	batch.incr(redisClient.set(x, JSON.stringify(record), redis.print) , redisClient.print);
        			batch.incr(redisClient.set(uuid.v1() , JSON.stringify(record), redis.print) , redisClient.print);
        		//	y.push(x);


        		/*	redisClient.get(y[0], function(getError, value) {
        						if (getError) {
        							throw error;
        						}
        						console.log('getting');
    	    					console.log(value);
        					});*/



        			batchCounter++;

        			if (batchCounter >= 20){
		        		batch.exec(function(er, replies) {
    		    			console.log('executing');
							console.log(replies);
						});
						batchCounter = 0;
						
				/*		for(var z = 0, w = y.length ; z < w ; z++){
							redisClient.get(y[z], function(getError, value) {
        						if (getError) {
        							throw error;
        						}
        						console.log('getting');
    	    					console.log(value);
        					});
						}
						y = [];*/
        			}

        		}
        	}
            //client.disconnect();
          });
      });
  });