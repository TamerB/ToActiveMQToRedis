'use strict';

const stompit = require('stompit');
var moment = require('moment');
var uuid = require('uuid/v1');
var Redis = require('ioredis');

var redis = new Redis();
var msgBuffer=[]; 
let lock = false;
var batch;
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

      console.log("buff size"+ msgBuffer.length,lock);

      var record = {};
      record = JSON.parse(body);
      msgBuffer.push(record);

      while(msgBuffer.length >= 20 && ! lock){
        batch = msgBuffer.splice(0,19);
        pushToRedis(batch);
      }    

    });
  });
});

function pushToRedis(arr){
  console.log("pushing the batch to redis") 
  
  var pipeline = redis.pipeline();
    if (msgBuffer.length < 20){
        lock=true;
    }

  console.log(arr.length);

  arr.forEach((record)=>{
    record.redis_timestamp = moment().format('YYY-MM-DDTHH:mm:ss.SSS');
    pipeline.set(uuid(), JSON.stringify(record));
  });

  pipeline.exec(function(err4, results) {
    if (err4) {
      console.log("pipeline error : " + err4.message);
    }
    lock=false;
    console.log(JSON.stringify(results));
  });
  console.log("batch of " + arr.length); 
}

process.stdin.resume();

function exitHandler(options, err5){
    if (options.cleanup) {
        while(msgBuffer.length >= 20 && ! lock){
            batch = msgBuffer.splice(0,20);
            pushToRedis(batch);
        }
        if (msgBuffer.length > 0 && msgBuffer.length < 20){
            pushToRedis(msgBuffer);
        }
        process.exit();
    }
}

process.on('exit', exitHandler.bind(null, {cleanup : true}));
process.on('SIGINT', exitHandler.bind(null, {cleanup : true}));
process.on('uncaughtException', exitHandler.bind(null, {cleanup : true}));