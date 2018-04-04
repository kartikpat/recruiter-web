var recruiter = {
    "name": "Shreya Jain",
    "isOnline": 1,
    "img_url": "http://www.iimjobs.com/resources/img/user_profile_new.png"
}


var recruiterEmail = profile.email;

    var pubnub = new PubNub({
    publishKey:"pub-c-78f4982d-59c1-4f7c-99bd-7840539dce3b",// "pub-c-5069ae94-20a5-4328-8281-4e1c630cd6f2",
    subscribeKey: "sub-c-cac4b854-8dc1-11e5-a04a-0619f8945a4f",//"sub-c-13938756-ada8-11e7-85f8-821de3cbacaa",
    // authKey: authkey,
    // logVerbosity: true,
    uuid: btoa(recruiterId+'--'+recruiterEmail),
    heartbeat: 120,
    heartbeat_interval: 30
    // logVerbosity: true,
    // ssl : true
    }, function(status) {
        console.log(status);
    });

    function getUUID() {
        return pubnub.getUUID();
    }

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

addListeners();

function getArray(array) {
    var tempArray = [];
    array.forEach(function(aChannel){
        tempArray.push(aChannel["channel"]);
    });
    return tempArray;
}

function addListeners(){
    pubnub.addListener({
        message: onNewMessage,
        presence: onNewPresence,
        status: onNewStatus
    });
}

function onNewMessage(m) {
    
    var actualChannel = m.actualChannel;
    var channelName = m.channel; // The channel for which the message belongs
    var msg = m.message; // The Payload
    var publisher = m.publisher;
    var subscribedChannel = m.subscribedChannel;
    var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
    var pubTT = m.timetoken; // Publish timetoken

    receiveMessage(m);
}

function onNewPresence(p) {
    // handle presence
    var action = p.action; // Can be join, leave, state-change or timeout
    var channelName = p.channel; // The channel for which the message belongs
    var channelGroup = p.subscription; //  The channel group or wildcard subscription match (if exists)
    var presenceEventTime = p.timestamp; // Presence event timetoken
    var status = p.status; // 200
    var message = p.message; // OK
    var service = p.service; // service
    var uuids = p.uuids; // UUIDs of users who are connected with the channel with their state
    var occupancy = p.occupancy; // No. of users connected with the channel
    console.log(p);
    receivePresence(p)
}



function onNewStatus(s) {
    // handle status
    var category = s.category; // PNConnectedCategory
    var operation = s.operation; // PNSubscribeOperation
    var affectedChannels = s.affectedChannels; // The channels affected in the operation, of type array.
    var subscribedChannels = s.subscribedChannels; // All the current subscribed channels, of type array.
    var affectedChannelGroups = s.affectedChannelGroups; // The channel groups affected in the operation, of type array.
    var lastTimetoken = s.lastTimetoken; // The last timetoken used in the subscribe request, of type long.
    var currentTimetoken = s.currentTimetoken; // The current timetoken fetched in the subscribe response, which is going to be used in the next request, of type long.
}

function subscribe(channelsArray) {
    pubnub.subscribe({
        channels: channelsArray,
        withPresence: true,
        disconnect: function() {alert("Connection Lost!")},
        reconnect : function() {alert("And we're Back!")}
    });
}

function unsubscribe(channelsArray) {
    pubnub.unsubscribe({
        channels: getArray(channelsArray)
    });
}

function fetchHistory(channel, count,startTimeToken, endTimeToken, onFetchHistory) {
    pubnub.history({
        channel: channel, //"my_channel",
        count: count,
        stringifiedTimeToken: true,
        start: startTimeToken,
        end: endTimeToken
    }, onFetchHistory);
}

function hereNow(channel, onHereNow) {
    pubnub.hereNow({
        channel: channel ,
        includeUUIDs: true,
        includeState: true

    }, onHereNow);
}

function onHereNow(status, response) {
    console.log(status)
    console.log(response)
}

function publish(message, channel, onPublish) {
    console.log(message);
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

function onPublish(status, response) {
    console.log("hi")
    console.log(status)
    console.log(response)
}
