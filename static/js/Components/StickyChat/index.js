jQuery(document).ready( function() {

    initializePubNub();
    addListeners(onNewMessage, onNewPresence, onNewStatus);
    subscribe(getArray(channelsArray));
    var chatSticky = ChatSticky();
    var store = Store();
    chatSticky.init()
    chatSticky.setProfile(profile)
    chatSticky.addToList(channelsArray);

    store.saveToStore(channelsArray);
    chatSticky.onClickSingleChatItem(function(candidateId){

        var obj = store.getCandidateFromStore(candidateId)

        fetchHistory(obj["name"], 20 , onFetchHistory);

        chatSticky.setCandidateProfile(obj)
    })

    chatSticky.onSendMessage(function(message, channelName){

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
            console.log("message sent");
        })
    })

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
       chatSticky.receiveMessage(msg,channelName);
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
           chatSticky.showStatusIcon(p.channel)
       }
       else if (p["action"] == "leave" && p["occupancy"] < 2 && p["uuid"] != uuid) {
           chatSticky.hideStatusIcon(p.channel)
       }
   }

   chatSticky.onInputSearchCandidate(function(str){
       var resultTags = []
       var array = channelsArray;
         for (var i=0; i < array.length; i++) {
             if (array[i]["name"] && array[i]["name"].toLowerCase().indexOf(str)>-1) {
                 resultTags.push(array[i]);
             }
         }
         chatSticky.addToList(resultTags);
    })




   function onFetchHistory(data, response) {
       console.log(data)
       console.log(response)
       chatSticky.populateMessages(response.messages)
   }
})
