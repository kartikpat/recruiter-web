var channelsArray = []

function getDeviceId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 20; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return "web"+text+Date.now();
}

$(document).ready(function(){
    var deviceId= getDeviceId();
    var chatEngine = ChatEngine(recruiterId, profile.email);
    chatEngine.initialize();
    chatEngine.addListeners(onNewMessage, onNewPresence, onNewStatus);
    var stickyChat=stickyChatModel();
    stickyChat.init();   
    fetchRecruiterChats(recruiterId)
    stickyChat.onClickSidebarChat(function(channelName,messageNumber,dataID,startTime){
        var eventObj = {
            event_category: eventMap["viewChatCardClick"]["cat"],
            event_label: 'origin='+origin+',recId='+recruiterId+''
        }
        sendEvent(eventMap["viewChatCardClick"]["event"], eventObj)
        if(!startTime){
            var scroll=0;
        }
        var obj = stickyChat.getCandidateFromStore(dataID)
        chatEngine.fetchHistory(channelName,messageNumber,startTime, null, function(data,response){
            onFetchHistory(response,obj,channelName,scroll)
        });
    })


    stickyChat.onClickStickyChat(function(channelName,messageNumber,dataID,startTime){
        var eventObj = {
            event_category: eventMap["viewChatCardClick"]["cat"],
            event_label: 'origin='+origin+',recId='+recruiterId+''
        }
        sendEvent(eventMap["viewChatCardClick"]["event"], eventObj);
        if(!startTime){
            var scroll=0;
        }
        var obj = stickyChat.getCandidateFromStore(dataID)
        chatEngine.fetchHistory(channelName,messageNumber,startTime, null, function(data,response){
            onFetchHistory(response,obj,channelName,scroll)
        });
    })

    stickyChat.onEnterSendMessage(function(dataID,channelName,message){
        var eventObj = {
            event_category: eventMap["sendMsg"]["cat"],
            event_label: 'origin='+origin+',recId='+recruiterId+''
        }
        sendEvent(eventMap["sendMsg"]["event"], eventObj)
        if(message == "") {
            return ;
        }
        stickyChat.appendSendMessage(channelName,message,dataID);                
        chatEngine.publish({
                UUID:uuid || btoa(recruiterId+'--'+profile["email"]),
                deviceId: deviceId,
                time: Date.now(),
                usr: recruiterId,
                name: profile["name"],
                tt:1,
                msg: message,
                dataID:dataID,
                img: profile.img_link,
                type: 1
            }, channelName, function(status, response){
                if(status.statusCode == 200) {
                }
                else if (status.category == "PNNetworkIssuesCategory") {
                    var data = {}
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

    function onFetchHistory(response,obj,channelName,scroll) {
        stickyChat.populateMessages(response,obj,channelName,scroll)
    }

    function onFetchRecruiterChats(topic, data) {
        stickyChat.populateChatView(data);
        stickyChat.populateSideChatView(data);
        stickyChat.saveToStore(data);
        channelsArray = data;
        chatEngine.subscribe(getArray(channelsArray));
    }

    function onFetchRecruiterChatsFail(topic, data) {
        errorHandler(data)
    }

    var fetchedRecruiterChatsSuccessSubscription = pubsub.subscribe('fetchedRecruiterChats', onFetchRecruiterChats)
	var fetchedRecruiterChatsFailSubscription = pubsub.subscribe('fetchedRecruiterChatsFail', onFetchRecruiterChatsFail)

    function getArray(array) {
        var tempArray = [];
        array.forEach(function(aChannel){
            tempArray.push(aChannel["channel"]);
        });
            return tempArray;
    }

    function onNewMessage(m) {
        var actualChannel = m.actualChannel;
        var channelName = m.channel; // The channel for which the message belongs
        var msg = m.message; // The Payload
        var publisher = m.publisher;
        var subscribedChannel = m.subscribedChannel;
        var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
        var pubTT = m.timetoken; // Publish timetoken
        if(deviceId == msg['deviceId']){
            return
        }
        if(stickyChat.isChatBoxOpen(channelName)){
            stickyChat.appendRecievedMessage(channelName,msg);
            stickyChat.scrollToBottom(m.channel);
        }
        else{
            stickyChat.openChatBox(channelName,chatEngine.fetchHistory);
            var obj = stickyChat.getCandidateFromStoreViaChannel(channelName)
            chatEngine.fetchHistory(channelName,20, null, null, function(data,response){
                onFetchHistory(response,obj,channelName)
            });
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
        stickyChat.receivePresence(p)
    }


})