var recruiter = {
    "name": "Shreya Jain",
    "isOnline": 1,
    "img_url": "http://www.iimjobs.com/resources/img/user_profile_new.png"
}

var recruiterID = localStorage.id;
var recruiterEmail;
var pubnub;

console.log(uuid)


function initializePubNub() {
    pubnub = new PubNub({
    publishKey: "pub-c-5069ae94-20a5-4328-8281-4e1c630cd6f2", // 'pub-c-63069c70-3e81-42b3-b5f6-dc0bd232f845'
    subscribeKey: "sub-c-13938756-ada8-11e7-85f8-821de3cbacaa", //'sub-c-760e7840-9e47-11e5-8db0-0619f8945a4f',
    uuid: setUUID(recruiterID+'--'+recruiterEmail),
    heartbeat: 120,
    heartbeatInterval: 30
    }, function(status) {
        
    });
}

function setUUID(string) {
    return btoa(string)
}

function getUUID() {
    return pubnub.getUUID();
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}


function getArray(array) {
    var tempArray = [];
    array.forEach(function(aChannel){
        tempArray.push(aChannel["channel"]);
    });
    return tempArray;
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

function hereNow(channels) {
    pubnub.hereNow({
        channels: channels,
        includeUUIDs: true,
        includeState: true

    }, function(status, response) {
        if(status["statusCode"] == 200) {
            channels.forEach(function(channel, index) {
                if(response.channels[channel].occupancy >= 2) {
                    // showOnlineIcon(channel);
                }
                else {
                    // removeOnlineIcon(channel);
                }
            })
        }
    });
}

function onHereNow(status, response) {
    console.log(status)
    console.log(response)

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
