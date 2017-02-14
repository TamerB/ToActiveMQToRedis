# ToActiveMQToRedis

This project consists of 2 parts:
1 - Generator : that generates JSON to ActiveMQ in certain frequency.
2 - Consumer : that consumes JSON from ActiveMQ and add them to Redis in batches.


To run this application :
1 - ActiveMQ must be up and connected on the defined port.
2 - If npm dependencies are not installed, run "npm install" in both generator and consumer folders.
3 - Run "node app.js" in consumer folder.
4 - Run "node app.js" in generator folder.


Issues:
- Number of records per batch sent to Redis may not be controlled whith high messaging frequency on ActiveMQ due to callback functions (Fixed, but looking for a better approach).
- Some messages might be lost with sudden exit of consumer application (Fixed).
