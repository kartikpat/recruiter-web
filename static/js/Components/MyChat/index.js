var channelsArray = []
globalParameters = {
    channelName: "",
    messageNumber: 10,
    startTimeToken: null,
    endTimeToken: null,
    clicked: 1,
    startChatConversation:1
}
function getDeviceId(n) {
    if(!n)
      n=20;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < n; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return "web"+text+Date.now();
}

jQuery(document).ready( function() {
  var deviceId= getDeviceId();
    var chatEngine = ChatEngine();
    chatEngine.initialize(recruiterId, profile.email);
    chatEngine.addListeners(onNewMessage, onNewPresence, onNewStatus);

    var chat = Chat();
    var store = Store();
    chat.init()
    fetchRecruiterChats(recruiterId);

    chat.onClickSingleChatItem(function(candidateId){
        chat.hideCandidateBlocks()
        $('.loading.loaderScroller.second').removeClass("hidden")
        var obj = store.getCandidateFromStore(candidateId)
        globalParameters.channelName = obj.channel;
        globalParameters.clicked = 1;
        chatEngine.fetchHistory(obj.channel , globalParameters.messageNumber , null, null, function(data,response){
            onFetchHistory(data, response, obj)
        });

    })

    var candidateId = getQueryParameter("candidateId");

    chat.setUuid(btoa(recruiterId+'--'+profile["email"]))

    chat.onSendMessage(function(message, channelName, candidateId){
      var t = Date.now();
        var id= getDeviceId(10);
        chat.appendSendMessage(message, profile["pic"], t,id, 1)
        chatEngine.publish({
            UUID:uuid || btoa(recruiterId+'--'+profile["email"]),
            deviceId: deviceId,
            time: t,
            usr: recruiterId,
            name: profile["name"],
            tt:1,
            msg: message,
            img: profile["pic"],
            type: 1,
            messageId: id
        }, channelName, function(status,response){

            if(status.statusCode == 200) {
            }
            else if (status.category == "PNNetworkIssuesCategory") {
                var data = {}
                console.log(id);
                chat.setFailedState(id);
                data.message = "Looks like you are not connected to the internet"
                toastNotify(3, data.message)
            }

        });
        submitChatMessage({
          channel: channelName,
          senderName: profile['name'],
          senderOrganization: profile["organisation"],
          timestamp: Date.now(),
          text: message
      })
    })

    function onFetchRecruiterChats(topic, data) {
        chat.addToList(data);
        channelsArray = data;
        store.saveToStore(data);
        chatEngine.subscribe(getArray(channelsArray));

        if(!isEmpty(candidateId)) {
            var obj = store.getCandidateFromStore(candidateId)
            globalParameters.channelName = obj.channel;
            chatEngine.fetchHistory(obj.channel , globalParameters.messageNumber , null, null, onFetchHistory);
            chat.setCandidateProfile(obj)
            chat.setChat(obj.channel, candidateId);
        }
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
       if(msg["deviceId"] == deviceId){
          chat.setDeliveredState(msg.messageId);
          return
       }
       chat.playSound();    
       if( msg["UUID"] == btoa(recruiterId+"--"+profile["email"])){
           chat.appendSendMessage( msg.msg, msg.img, msg.t);
       }
       else{
          chat.receiveMessage(msg,channelName);
       }
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
       if(s.operation=="PNSubscribeOperation"){
        return chatEngine.hereNow(s.subscribedChannels,handleState);
       }
   }

   function handleState(response){
    var channels = getArray(channelsArray);
    console.log(response)
    channels.forEach(function(channel, index) {
        if(response.channels[channel].occupancy >= 2) {
            chat.showStatusIcon(channel);
        }
        else {
            chat.hideStatusIcon(channel)
        }
    });
    debugger
   }

   chat.onInputSearchCandidate(function(str){
       var resultTags = []
       resultTags.index=1;
       var array = channelsArray;
         for (var i=0; i < array.length; i++) {
             if (array[i]["name"] && array[i]["name"].toLowerCase().indexOf(str)>-1) {
                 resultTags.push(array[i]);
             }
         }
         chat.addToList(resultTags);
    })

   function onFetchHistory(data, response, obj) {
       chat.hideSpinner();
       globalParameters.startTimeToken = parseInt(response.startTimeToken)
       chat.populateMessages(response.messages,globalParameters.startChatConversation)
       chat.setCandidateProfile(obj)
       if(globalParameters.clicked == 1) {
           chat.scrollToBottom()
           globalParameters.clicked = 0;
       }
   }


   var ticker;
   $(".current-chat").scroll(function(){
       clearTimeout(ticker);
       ticker = setTimeout(checkScrollEnd,100);
   })

   function checkScrollEnd() {
       if($(".current-chat").scrollTop() < 5) {
           if(globalParameters.startTimeToken == 0) {
               return
           }
           chat.showSpinner();
           globalParameters.startChatConversation=0;
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
                
        return toastNotify(3, "Looks like you are not connected to the internet");
    }
    if(data.status == 503) {
        toastNotify(3, "Oops...something went wrong. Our engineers are fixing the issue");
         return
    }
    return toastNotify(3, res.message);
}
