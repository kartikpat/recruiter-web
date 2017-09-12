var channelsArray = [
  {
     "id":9443,
    "jobseekerID":"511594",
    "jobID":"334895",
    "name":"iimjobs--r45058-j511594",
    "lastActive":"2017-06-1418:20:28"
  },
  {
     "id":24615,
    "jobseekerID":"709365",
    "jobID":"334895",
    "name":"iimjobs--r45058-j709365",
    "lastActive":"2016-10-0317:22:05"
  },
  {
     "id":24608,
    "jobseekerID":"612792",
    "jobID":"334895",
    "name":"iimjobs--r45058-j612792",
    "lastActive":"2016-10-0316:04:23"
  },
  {
     "id":24607,
    "jobseekerID":"110923",
    "jobID":"334895",
    "name":"iimjobs--r45058-j110923",
    "lastActive":"2016-10-0316:04:18"
  },
  {
     "id":24606,
    "jobseekerID":"711080",
    "jobID":"334895",
    "name":"iimjobs--r45058-j711080",
    "lastActive":"2016-10-0316:04:14"
  },
  {
     "id":23623,
    "jobseekerID":"706831",
    "jobID":"334895",
    "name":"iimjobs--r45058-j706831",
    "lastActive":"2016-09-2117:17:20"
  },
  {
     "id":23622,
    "jobseekerID":"676776",
    "jobID":"334895",
    "name":"iimjobs--r45058-j676776",
    "lastActive":"2016-09-2117:17:12"
  },
  {
     "id":23621,
    "jobseekerID":"712558",
    "jobID":"334895",
    "name":"iimjobs--r45058-j712558",
    "lastActive":"2016-09-2117:17:09"
  },
  {
     "id":22909,
    "jobseekerID":"337587",
    "jobID":"0",
    "name":"iimjobs--r45058-j337587",
    "lastActive":"2016-09-1412:22:23"
  },
  {
     "id":9441,
    "jobseekerID":"651703",
    "jobID":"334895",
    "name":"iimjobs--r45058-j651703",
    "lastActive":"2016-05-2611:30:21"
  },
  {
     "id":9531,
    "jobseekerID":"462122",
    "jobID":"334895",
    "name":"iimjobs--r45058-j462122",
    "lastActive":"2016-05-2112:44:01"
  },
  {
     "id":9497,
    "jobseekerID":"178541",
    "jobID":"0",
    "name":"iimjobs--r45058-j178541",
    "lastActive":"2016-05-2109:27:05"
  },
  {
     "id":9643,
    "jobseekerID":"699540",
    "jobID":"0",
    "name":"iimjobs--r45058-j699540",
    "lastActive":"2016-05-1810:59:43"
  },
  {
     "id":9411,
    "jobseekerID":"293084",
    "jobID":"334895",
    "name":"iimjobs--r45058-j293084",
    "lastActive":"2016-05-1613:09:53"
  },
  {
     "id":9388,
    "jobseekerID":"62147",
    "jobID":"334895",
    "name":"iimjobs--r45058-j62147",
    "lastActive":"2016-05-1422:24:58"
  },
  {
     "id":9341,
    "jobseekerID":"419400",
    "jobID":"0",
    "name":"iimjobs--r45058-j419400",
    "lastActive":"2016-05-1315:30:08"
  },
  {
     "id":9335,
    "jobseekerID":"480373",
    "jobID":"334895",
    "name":"iimjobs--r45058-j480373",
    "lastActive":"2016-05-1315:10:04"
  },
  {
     "id":30680,
    "jobseekerID":"260854",
    "jobID":"0",
    "name":"iimjobs--r45058-j260854",
    "lastActive":"NULL"
  },
  {
     "id":9644,
    "jobseekerID":"429324",
    "jobID":"0",
    "name":"iimjobs--r45058-j429324",
    "lastActive":"NULL"
  },
  {
     "id":9448,
    "jobseekerID":"712518",
    "jobID":"334895",
    "name":"iimjobs--r45058-j712518",
    "lastActive":"NULL"
  },
  {
     "id":9396,
    "jobseekerID":"435817",
    "jobID":"0",
    "name":"iimjobs--r45058-j435817",
    "lastActive":"NULL"
  },
  {
     "id":35214,
    "jobseekerID":"229312",
    "jobID":"0",
    "name":"iimjobs--r45058-j229312",
    "lastActive":"NULL"
  }];

var pubnub = new PubNub({
    publishKey: "pub-c-71dbc9d4-a833-4c0a-b47e-9955abbb9dac",
    subscribeKey: "sub-c-59cd3794-96d3-11e7-b1db-b273e40390ab",
    // authKey: authkey,
    // logVerbosity: true,
    uuid            : "NDUwNTgtLXNocmV5YUBpaW1qb2JzLmNvbQ==",
    heartbeat       : 120,
    heartbeat_interval: 30,
    logVerbosity: true,
    // ssl : true
    },function(status){console.log(status);
});

pubnub.addListener({   
    message: function(m) {
        // handle message
        var actualChannel = m.actualChannel;
        var channelName = m.channel; // The channel for which the message belongs
        var msg = m.message; // The Payload
        var publisher = m.publisher;
        var subscribedChannel = m.subscribedChannel;
        var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
        var pubTT = m.timetoken; // Publish timetoken     
        console.log(m) ;
    },
    presence: function(p) {
        // handle presence
        var action = p.action; // Can be join, leave, state-change or timeout
        var channelName = p.channel; // The channel for which the message belongs
        var channelGroup = p.subscription; //  The channel group or wildcard subscription match (if exists)
        var presenceEventTime = p.timestamp; // Presence event timetoken
        var status = p.status; // 200
        var message = p.message; // OK
        var service = p.service; // service
        var uuids = p.uuids;  // UUIDs of users who are connected with the channel with their state
        var occupancy = p.occupancy; // No. of users connected with the channel
    },
    status: function(s) {
        // handle status
        var category = s.category; // PNConnectedCategory
        var operation = s.operation; // PNSubscribeOperation
        var affectedChannels = s.affectedChannels; // The channels affected in the operation, of type array.
        var subscribedChannels = s.subscribedChannels; // All the current subscribed channels, of type array.
        var affectedChannelGroups = s.affectedChannelGroups; // The channel groups affected in the operation, of type array.
        var lastTimetoken = s.lastTimetoken; // The last timetoken used in the subscribe request, of type long.
        var currentTimetoken = s.currentTimetoken; // The current timetoken fetched in the subscribe response, which is going to be used in the next request, of type long.
    }
});
  
pubnub.subscribe({
  channels: ["my_channel"]
});

pubnub.publish(
    {
        message: {
            such: 'string'
        },
        channel: 'my_channel',
        sendByPost: false, // true to send via post
        storeInHistory: true, //override default storage options
        meta: {
            "cool": "meta"
        } // publish extra meta with the request
    },
    function (status, response) {
        console.log(status)
        console.log(response)
    }
);

pubnub.history(
    {
        channel: "my_channel",
        count: 10,
        includeTimetoken: false
    },
    function (status, response) {
      console.log(status);
      console.log(response)
    });

