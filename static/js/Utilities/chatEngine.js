function ChatEngine(){
	function initialize(recruiterId, email) {
	    pubnub = new PubNub({
		    publishKey:pubKey,// "pub-c-5069ae94-20a5-4328-8281-4e1c630cd6f2",
	    	subscribeKey: subKey,//"sub-c-13938756-ada8-11e7-85f8-821de3cbacaa",
		    uuid: setUUID(recruiterId+'--'+email),
		    restore: true,
		    heartbeat: 120,
		    heartbeatInterval: 30
	    }, function(status) {
	        console.log(status);
	    });
	}

	function setUUID(string) {
	    return btoa(string)
	}
	function getUUID() {
	    return pubnub.getUUID();
	}

	function addListeners(onNewMessage, onNewPresence, onNewStatus){
	    pubnub.addListener({
	        message: onNewMessage,
	        presence: onNewPresence,
	        status: onNewStatus
	    });
	}

	function subscribe(channelsArray) {
	    pubnub.subscribe({
	        channels: channelsArray,
	        withPresence: true,
	        restore : true,
	        disconnect: function() {alert("Connection Lost!")},
	        reconnect : function() {alert("And we're Back!")}
	    });
	}

	function unsubscribe(channelsArray) {
	    pubnub.unsubscribe({
	        channels:  getArray(channelsArray)
	    });
	}

	function fetchHistory(channel, count, startTimeToken, endTimeToken, onFetchHistory) {
		pubnub.history({
	        channel: channel, //"my_channel",
	        count: count,
	        stringifiedTimeToken: false,
	        start: startTimeToken,
	        end: endTimeToken

	    }, onFetchHistory);
	}

	function hereNow(channels, fn) {
	    pubnub.hereNow({
	        channels: channels,
	        includeUUIDs: true,
	        includeState: true

	    }, function(status, response) {
	        if(status["statusCode"] == 200) {
	            fn(response);
	        }
	    });
	}

	function publish(message, channel, onPublish) {
	    pubnub.publish({
	        message: message,
	        channel: channel,
	        sendByPost: true, // true to send via post
	        storeInHistory: true, //override default storage options
	        meta: {
	            "cool": "meta"
	        } // publish extra meta with the request
	    }, onPublish)
	}
	
	return {
		initialize: initialize,
		addListeners: addListeners,
		fetchHistory: fetchHistory,
		subscribe: subscribe,
		publish: publish,
		getUUID: getUUID,
		hereNow: hereNow
	}

}
