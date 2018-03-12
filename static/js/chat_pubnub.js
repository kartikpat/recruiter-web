var recruiter = {
    "name": "Shreya Jain",
    "isOnline": 1,
    "img_url": "http://www.iimjobs.com/resources/img/user_profile_new.png"
}

var channelsArray = [{
        "id": 9443,
        "jobseekerID": "511594",
        "jobID": "334895",
        "name": "iimjobs--r45058-j511594",
        "lastActive": "2012-07-14T01:00:00+01:00"
    }, {
        "id": 24615,
        "jobseekerID": "709365",
        "jobID": "334895",
        "name": "iimjobs--r45058-j709365",
        "lastActive": "2012-07-14T01:00:00+01:00"
    }, {
        "id": 24608,
        "jobseekerID": "612792",
        "jobID": "334895",
        "name": "iimjobs--r45058-j612792",
        "lastActive": "2012-07-14T01:00:00+01:00"
    }, {
        "id": 24607,
        "jobseekerID": "110923",
        "jobID": "334895",
        "name": "iimjobs--r45058-j110923",
        "lastActive": "2012-07-14T01:00:00+01:00"
    }, {
        "id": 24606,
        "jobseekerID": "711080",
        "jobID": "334895",
        "name": "iimjobs--r45058-j711080",
        "lastActive": "2012-07-14T01:00:00+01:00"
    }, {
        "id": 23623,
        "jobseekerID": "706831",
        "jobID": "334895",
        "name": "iimjobs--r45058-j706831",
        "lastActive": "2012-07-14T01:00:00+01:00"
    }, {
        "id": 23622,
        "jobseekerID": "676776",
        "jobID": "334895",
        "name": "iimjobs--r45058-j676776",
        "lastActive": "2012-07-14T01:00:00+01:00"
    }, {
        "id": 23621,
        "jobseekerID": "712558",
        "jobID": "334895",
        "name": "iimjobs--r45058-j712558",
        "lastActive": "2012-07-14T01:00:00+01:00"
    }, {
        "id": 22909,
        "jobseekerID": "337587",
        "jobID": "0",
        "name": "iimjobs--r45058-j337587",
        "lastActive": "2012-07-14T01:00:00+01:00"
    }, {
        "id": 9441,
        "jobseekerID": "651703",
        "jobID": "334895",
        "name": "iimjobs--r45058-j651703",
        "lastActive": "2012-07-14T01:00:00+01:00"
    }, {
        "id": 9531,
        "jobseekerID": "462122",
        "jobID": "334895",
        "name": "iimjobs--r45058-j462122",
        "lastActive": "2012-07-14T01:00:00+01:00"
    }, {
        "id": 9497,
        "jobseekerID": "178541",
        "jobID": "0",
        "name": "iimjobs--r45058-j178541",
        "lastActive": "2016-05-2109:27:05"
    }, {
        "id": 9643,
        "jobseekerID": "699540",
        "jobID": "0",
        "name": "iimjobs--r45058-j699540",
        "lastActive": "2016-05-1810:59:43"
    }, {
        "id": 9411,
        "jobseekerID": "293084",
        "jobID": "334895",
        "name": "iimjobs--r45058-j293084",
        "lastActive": "2016-05-1613:09:53"
    }, {
        "id": 9388,
        "jobseekerID": "62147",
        "jobID": "334895",
        "name": "iimjobs--r45058-j62147",
        "lastActive": "2016-05-1422:24:58"
    }, {
        "id": 9341,
        "jobseekerID": "419400",
        "jobID": "0",
        "name": "iimjobs--r45058-j419400",
        "lastActive": "2016-05-1315:30:08"
    }, {
        "id": 9335,
        "jobseekerID": "480373",
        "jobID": "334895",
        "name": "iimjobs--r45058-j480373",
        "lastActive": "2016-05-1315:10:04"
    }, {
        "id": 30680,
        "jobseekerID": "260854",
        "jobID": "0",
        "name": "iimjobs--r45058-j260854",
        "lastActive": "NULL"
    }, {
        "id": 9644,
        "jobseekerID": "429324",
        "jobID": "0",
        "name": "iimjobs--r45058-j429324",
        "lastActive": "NULL"
    }, {
        "id": 9448,
        "jobseekerID": "712518",
        "jobID": "334895",
        "name": "iimjobs--r45058-j712518",
        "lastActive": "NULL"
    }, {
        "id": 9396,
        "jobseekerID": "435817",
        "jobID": "0",
        "name": "iimjobs--r45058-j435817",
        "lastActive": "NULL"
    }, {
        "id": 35214,
        "jobseekerID": "229312",
        "jobID": "0",
        "name": "iimjobs--r45058-j229312",
        "lastActive": "NULL"
}];

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
        console.log(status);
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

// function onNewMessage(m) {
//     console.log(m);
//     var actualChannel = m.actualChannel;
//     var channelName = m.channel; // The channel for which the message belongs
//     var msg = m.message; // The Payload
//     var publisher = m.publisher;
//     var subscribedChannel = m.subscribedChannel;
//     var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
//     var pubTT = m.timetoken; // Publish timetoken
//     console.log("receieved new message")
//     console.log(msg)
//     receiveMessage(msg,channelName);
// }
//
// function onNewPresence(p) {
//     // handle presence
//     var action = p.action; // Can be join, leave, state-change or timeout
//     var channelName = p.channel; // The channel for which the message belongs
//     var channelGroup = p.subscription; //  The channel group or wildcard subscription match (if exists)
//     var presenceEventTime = p.timestamp; // Presence event timetoken
//     var status = p.status; // 200
//     var message = p.message; // OK
//     var service = p.service; // service
//     var uuids = p.uuids; // UUIDs of users who are connected with the channel with their state
//     var occupancy = p.occupancy; // No. of users connected with the channel
//
//     receivePresence(p)
// }

// function onNewStatus(s) {
//     console.log(s)
//     // handle status
//     var category = s.category; // PNConnectedCategory
//     var operation = s.operation; // PNSubscribeOperation
//     var affectedChannels = s.affectedChannels; // The channels affected in the operation, of type array.
//     var subscribedChannels = s.subscribedChannels; // All the current subscribed channels, of type array.
//     var affectedChannelGroups = s.affectedChannelGroups; // The channel groups affected in the operation, of type array.
//     var lastTimetoken = s.lastTimetoken; // The last timetoken used in the subscribe request, of type long.
//     var currentTimetoken = s.currentTimetoken; // The current timetoken fetched in the subscribe response, which is going to be used in the next request, of type long.
//
//
// }

// function checkForStatusChange(status) {
//     if(status.operation=="PNSubscribeOperation"){
//         checkForOnline(status.affectedChannels);
//     }
// }

// function checkForOnline(channels) {
//     hereNow(channels)
// }

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
    // console.log(status)
    // console.log(response)

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
