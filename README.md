# ToActiveMQToRedis

This project consists of 2 parts:
1 - Generator : that generates JSON to ActiveMQ for 30 minutes in a rate of 250/sec.
2 - Consumer : that consumes JSON from ActiveMQ and add them to Redis in batches(20/batch).


To run this application :
1 - ActiveMQ must be up and connected on the defined the port.
2 - If npm dependencies are not installed, run "npm install" in both generator and consumer folders.
3 - Run "node app.js" in consumer folder.
4 - Run "node app.js" in generator folder.

Notes:
- ActiveMQ is connected on localhost and port 61613. So don't forget to change host and port if needed in both generator/app.js and consumer/app.js
- The commented blocks in consumer/app.js are for testing of number of records. If you chose to use them please run "npm install redis" (since they uses redis not ioredis), uncomment line 7 and lines 85 through 98 and comment line 83. And of course don't forget to change host and port if needed.


Issues:
- Number of records per batch sent to Redis may not be controlled whith high messaging frequency on ActiveMQ due to callback functions (Fixed, but still looking for a better approach).
