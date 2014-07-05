var redis = require('redis'),
    client1 = redis.createClient(), msg_count = 0,
    client2 = redis.createClient();

redis.debug_mode = false;

client1.on("subscribe", function(channel, count){
	console.log("client1 subscribed to " + channel + ", " + count + " total subscriptions");
	if(count === 2){
		client2.publish("This is a channel", "I am sending a message");
	       	client2.publish("This is another comment", "message 2z");
	}
});

client1.on("unsubscribe", function(channel, count){
	console.log("client1 unsubscribed to " + channel + ", " + count + " total subscriptions");
	if(count === 0){
		client1.end();
		client2.end();
	}	
});

client1.on("message", function(channel, message){
	console.log("This is a message on channel " + channel + " with this message " + message);
	msg_count += 1;
	if(msg_count === 3){
		client1.unsubscribe();
	}
});

client1.on("ready", function(){
	client1.incr("did a thing");
	client1.subscribe("This is a channel", "another one!");
});

client2.on("ready", function(){
	//this is an auth place.
});
