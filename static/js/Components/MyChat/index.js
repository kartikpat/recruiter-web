var channelsArray = []

jQuery(document).ready( function() {

    initializePubNub();
    addListeners(onNewMessage, onNewPresence, onNewStatus);
    subscribe(getArray(channelsArray));
    var chat = Chat();
    var store = Store();
    chat.init()
    chat.setProfile(profile)
    fetchRecruiterChats(recruiterId)

    chat.onClickSingleChatItem(function(candidateId){

        var obj = store.getCandidateFromStore(candidateId)

        fetchHistory(obj.channel , 20 , onFetchHistory);
        chat.setCandidateProfile(obj)
    })

    chat.onSendMessage(function(message, channelName, candidateId){

        publish({
            UUID:btoa(recruiterId+'--'+profile["email"]),
            deviceID: getCookie("sessID"),
            time: Date.now(),
            usr: recruiterId,
            name: profile["name"],
            tt:1,
            msg: message,
            img: profile["pic"],
            type: 1
        }, channelName, function(m){
            console.log(m)
            var obj = store.getCandidateFromStore(candidateId)
            chat.appendSendMessage(message, obj)
        })

    })

    function onFetchRecruiterChats(topic, data) {
        console.log(data)
        chat.addToList(data);
        channelsArray = data;
        store.saveToStore(data);
    }

    function onFetchRecruiterChatsFail(topic, data) {
        errorHandler(data)
    }

    var fetchedRecruiterChatsSuccessSubscription = pubsub.subscribe('fetchedRecruiterChats', onFetchRecruiterChats)
	var fetchedRecruiterChatsFailSubscription = pubsub.subscribe('fetchedRecruiterChatsFail', onFetchRecruiterChatsFail)

    function getCookie(name) {
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if (parts.length == 2) return parts.pop().split(";").shift();
    }


   function onNewMessage(m) {
       console.log(m);
       var actualChannel = m.actualChannel;
       var channelName = m.channel; // The channel for which the message belongs
       var msg = m.message; // The Payload
       var publisher = m.publisher;
       var subscribedChannel = m.subscribedChannel;
       var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
       var pubTT = m.timetoken; // Publish timetoken
       console.log("receieved new message")
       console.log(msg)
       if( msg["deviceID"] == getCookie("sessID") && msg["UUID"] == btoa(recruiterId+'--'+profile["email"]) ){
           return
       }
       chat.receiveMessage(msg,channelName);
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
       console.log(p)
       var uuid = getUUID();
       if(p["action"] == "join" && p["occupancy"] >= 2 && p["uuid"] != uuid) {
           chat.showStatusIcon(p.channel)
       }
       else if (p["action"] == "leave" && p["occupancy"] < 2 && p["uuid"] != uuid) {
           chat.hideStatusIcon(p.channel)
       }
   }

   chat.onInputSearchCandidate(function(str){
       var resultTags = []
       var array = channelsArray;
         for (var i=0; i < array.length; i++) {
             if (array[i]["name"] && array[i]["name"].toLowerCase().indexOf(str)>-1) {
                 resultTags.push(array[i]);
             }
         }
         chat.addToList(resultTags);
    })

   function onFetchHistory(data, response) {
       console.log(data)
       console.log(response)
       chat.populateMessages(response.messages)
   }
})

function errorHandler(data) {
    if(!data) {
        return toastNotify(3, "Something went wrong");
    }
    return toastNotify(3, data.message);
}
