var channelsArray = []
globalParameters = {
    channelName: "",
    messageNumber: 10,
    clicked: 1,
    startTimeToken: null,
    endTimeToken: null
}

jQuery(document).ready( function() {

    var chatEngine = ChatEngine(recruiterId, profile.email);
    chatEngine.initialize();
    chatEngine.addListeners(onNewMessage, onNewPresence, onNewStatus);

    var chat = Chat();
    var store = Store();
    chat.init()
    chat.setProfile(profile)
    fetchRecruiterChats(recruiterId)

    chat.onClickSingleChatItem(function(candidateId){
        var obj = store.getCandidateFromStore(candidateId)
        globalParameters.channelName = obj.channel;
        globalParameters.clicked = 1;
        chatEngine.fetchHistory(obj.channel , globalParameters.messageNumber , null, null, onFetchHistory);
        chat.setCandidateProfile(obj)
    })

    chat.setUuid(btoa(recruiterId+'--'+profile["email"]))

    chat.onSendMessage(function(message, channelName, candidateId){

        chatEngine.publish({
            UUID:uuid || btoa(recruiterId+'--'+profile["email"]),
            deviceID: getCookie("sessID"),
            time: Date.now(),
            usr: recruiterId,
            name: profile["name"],
            tt:1,
            msg: message,
            img: profile["pic"],
            type: 1
        }, channelName, function(status,response){


            if(status.statusCode == 200) {
                chat.appendSendMessage(message, profile["pic"])
            }
            else if (status.category == "PNNetworkIssuesCategory") {
                var data = {}
                data.message = "Network Issues"
                toastNotify(3, data.message)
            }

        })

    })

    function onFetchRecruiterChats(topic, data) {
        chat.addToList(data);
        channelsArray = data;
        store.saveToStore(data);
        chatEngine.subscribe(getArray(channelsArray));
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

       var actualChannel = m.actualChannel;
       var channelName = m.channel; // The channel for which the message belongs
       var msg = m.message; // The Payload
       var publisher = m.publisher;
       var subscribedChannel = m.subscribedChannel;
       var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
       var pubTT = m.timetoken; // Publish timetoken

       if( msg["deviceID"] == getCookie("sessID") && msg["UUID"] == btoa(recruiterId+'--'+profile["email"])){
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


       if(p["action"] == "join" && p["occupancy"] >= 2 && p["uuid"] != (uuid || chatEngine.getUUID())) {
           chat.showStatusIcon(p.channel)
       }
       else if (p["action"] == "leave" && p["occupancy"] < 2 && p["uuid"] != (uuid || chatEngine.getUUID())) {
           chat.hideStatusIcon(p.channel)
       }
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

       if(s.category == "PNNetworkDownCategory") {
           return chat.setRecruiterInactive(s)
       }
       if(s.category == "PNNetworkUpCategory") {
           return chat.setRecruiterActive(s)
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
       globalParameters.startTimeToken = parseInt(response.startTimeToken)
       chat.populateMessages(response.messages)
    //    if(globalParameters.clicked == 1) {
    //        chat.scrollToBottom()
    //    }
   }

   var ticker;
   $(".current-chat").scroll(function(){
       clearTimeout(ticker);
       ticker = setTimeout(checkScrollEnd,100);
   })

   function checkScrollEnd() {
       if($(".current-chat").scrollTop() < 5) {
        //    globalParameters.clicked = 0;
           if(globalParameters.startTimeToken == 0) {
               return
           }
           chatEngine.fetchHistory(globalParameters.channelName , globalParameters.messageNumber ,globalParameters.startTimeToken, null, onFetchHistory);
       }
   }
})

function getArray(array) {
    var tempArray = [];
    array.forEach(function(aChannel){
        tempArray.push(aChannel["channel"]);
    });
    return tempArray;
}

function errorHandler(data) {
    var res = data.responseJSON
    if(!res) {
        return toastNotify(3, "Something went wrong");
    }
    return toastNotify(3, res.message);
}
