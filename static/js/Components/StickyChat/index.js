var channelsArray = []
var global={
    channelName:"",
    boxOpen:0
}

function getDeviceId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 20; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return "web"+text+Date.now();
}

// var chat=chatModelIndex();


function chatModelIndex(){
    var deviceId= getDeviceId();
    var chatEngine = ChatEngine();
    chatEngine.initialize(recruiterId, profile.email);
    chatEngine.addListeners(onNewMessage, onNewPresence, onNewStatus);
    var stickyChat=stickyChatModel();
    var store=chatStoreModel();
    stickyChat.init();   

    function init(){
        stickyChat.init(); 
    }    
    
    fetchRecruiterChats(recruiterId);
    
    stickyChat.onClickSidebarChat(function(channelName,messageNumber,dataID,startTime){
        var scrollToBottom=0;
        var eventObj = {
            event_category: eventMap["viewChatCardClick"]["cat"],
            event_label: 'origin='+origin+',recId='+recruiterId+''
        }
        var obj=store.getCandidateFromStore(dataID);
        stickyChat.populateChatBox(channelName,dataID,obj);
        sendEvent(eventMap["viewChatCardClick"]["event"], eventObj)
        var obj = store.getCandidateFromStore(dataID)
        chatEngine.fetchHistory(channelName,messageNumber,startTime, null, function(data,response){
            onFetchHistory(response,obj,channelName,scrollToBottom)
        });
        stickyChat.scrollEvent(channelName,obj,function(channelName,startTime){
            scrollToBottom=1;
            chatEngine.fetchHistory(channelName,20,startTime, null, function(data,response){
                onFetchHistory(response,obj,channelName,scrollToBottom)
            });
        });
    })

    stickyChat.onClickStickyChat(function(channelName,messageNumber,dataID,startTime){
        var scrollToBottom=0;
        var eventObj = {
            event_category: eventMap["viewChatCardClick"]["cat"],
            event_label: 'origin='+origin+',recId='+recruiterId+''
        }
        sendEvent(eventMap["viewChatCardClick"]["event"], eventObj);
        var obj = store.getCandidateFromStore(dataID)
        stickyChat.populateChatBox(channelName,dataID,obj);
        chatEngine.fetchHistory(channelName,messageNumber,startTime, null, function(data,response){
            onFetchHistory(response,obj,channelName,scrollToBottom)
        });
        stickyChat.scrollEvent(channelName,obj,function(channelName,startTime){
            scrollToBottom=1;
            chatEngine.fetchHistory(channelName,20,startTime, null, function(data,response){
                onFetchHistory(response,obj,channelName,scrollToBottom)
            });
        });
    })

    stickyChat.onEnterSendMessage(function(dataID,channelName,message){
        SendMessage(dataID,channelName,message);     
    })

    function SendMessage(dataID,channelName,message){
        var eventObj = {
            event_category: eventMap["sendMsg"]["cat"],
            event_label: 'origin='+origin+',recId='+recruiterId+''
        }
        var id= getDeviceId(10);
        sendEvent(eventMap["sendMsg"]["event"], eventObj)
        if(message == "") {
            return ;
        }
        stickyChat.appendSendMessage(channelName,message,dataID,1,id);                
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
                    // var data = {}
                    // data.message = "Looks like you are not connected to the internet"
                    // toastNotify(3, data.message)
                    stickyChat.setFailedState(id);
                }
            });
            submitChatMessage({
                channel: channelName,
                senderName: profile['name'],
                senderOrganization: profile["organisation"],
                timestamp: Date.now(),
                text: message
            })
    }

    function onFetchHistory(response,obj,channelName,scroll) {
        stickyChat.hideSpinner(channelName);
        stickyChat.populateMessages(response,obj,channelName,scroll)
    }

    function onFetchRecruiterChats(topic, data) {
        stickyChat.populateChatView(data);
        stickyChat.populateSideChatView(data);
        store.saveToStore(data);
        channelsArray = data;
        chatEngine.subscribe(getArray(channelsArray));
    }

    function onFetchRecruiterChatsFail(topic, data) {
        errorHandler(data)
    }

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
        var scrollToBottom=0;

        if(deviceId == msg['deviceId']){
            stickyChat.setDeliveredState(channelName);
            return
        }
        
        if(!(msg["UUID"] == btoa(recruiterId+"--"+profile["email"]))){
            stickyChat.playSound();
            if(stickyChat.isChatBoxOpen(channelName)){
                stickyChat.appendRecievedMessage(channelName,msg);
                stickyChat.scrollToBottom(m.channel);
            }
            else{
                var obj = store.getCandidateFromStoreViaChannel(channelName)
                stickyChat.openChatBox(channelName,obj);
                chatEngine.fetchHistory(channelName,20, null, null, function(data,response){
                    onFetchHistory(response,obj,channelName,scrollToBottom)
                });
                stickyChat.scrollEvent(channelName,obj,function(channelName,startTime){
                    scrollToBottom=1;
                    chatEngine.fetchHistory(channelName,20,startTime, null, function(data,response){
                        onFetchHistory(response,obj,channelName,scrollToBottom)
                    });
                });
            }   
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
           return stickyChat.setRecruiterInactive(s)
        }
        if(s.category == "PNNetworkUpCategory") {
            return stickyChat.setRecruiterActive(s)
        }
        if(s.operation=="PNSubscribeOperation"){
            return chatEngine.hereNow(s.subscribedChannels,handleState);
        }
    }


    function handleState(response){
        var channels = getArray(channelsArray);
        channels.forEach(function(channel, index) {
            if(response.channels[channel].occupancy >= 2) {
                stickyChat.showStatusIcon(channel);
            }
            else {
                stickyChat.hideStatusIcon(channel)
            }
        });
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
           stickyChat.showStatusIcon(p.channel)
       }
       else if (p["action"] == "leave" && p["occupancy"] < 2 && p["uuid"] != (uuid || chatEngine.getUUID())) {
           stickyChat.hideStatusIcon(p.channel)
       }
       

    }

    function createNewChannel(recruiterId,jobId,applicationId,obj,inviteObj){
            var userId=obj[0].userID;
            var channelName=baseDomain+"--r"+recruiterId+'-j'+userId;
            if(channelName==global.channelName && !(inviteObj)){
                return
            }
            if(!store.getCandidateFromStoreViaChannel(channelName)){
                if(window.innerWidth>768){
                    if(!(global.channelName==channelName))
                    stickyChat.openChatBox(channelName,obj); 
                    global.channelName=channelName;
                    stickyChat.disableChat(channelName);
                }
                submitChatProfile(recruiterId,jobId,applicationId,obj,inviteObj);
                // store.updateToStore();
                return    
            }
            if(window.innerWidth <= 768) {
                window.location.href = staticEndPoints['chat']+'?candidateId='+obj[0].userID+''
                return
            }
            var obj=store.getCandidateFromStoreViaChannel(channelName);
            var scrollToBottom=0;
            if(window.innerWidth>768){
                stickyChat.openChatBox(channelName,obj);
            }
            chatEngine.fetchHistory(channelName,20, null, null, function(data,response){
                onFetchHistory(response,obj,channelName,scrollToBottom)
            });
            stickyChat.scrollEvent(channelName,obj,function(channelName,startTime){
                scrollToBottom=1;
                chatEngine.fetchHistory(channelName,20,startTime, null, function(data,response){
                    onFetchHistory(response,obj,channelName,scrollToBottom)
                });
            });
        
    }

    var submitChatSuccessSubscription = pubsub.subscribe("submitChatProfileSuccess",onSuccessfulSubmitChat)
    var failChatSubscription = pubsub.subscribe("submitChatProfileFail",onFailedSubmitChat)
    var fetchedRecruiterChatsSuccessSubscription = pubsub.subscribe('fetchedRecruiterChats', onFetchRecruiterChats)
    var fetchedRecruiterChatsFailSubscription = pubsub.subscribe('fetchedRecruiterChatsFail', onFetchRecruiterChatsFail)        


    function onSuccessfulSubmitChat(topic,data){
        if(window.innerWidth <= 768) {
            window.location.href = staticEndPoints['chat']+'?candidateId='+data.array[0]["userID"]+''
        }
        stickyChat.enableChat(data.data.channel);
        data.array[0]["channel"] = data.data.channel;
        store.updateStore(data.array[0]);
        stickyChat.populateChatView(data.array);
        if(data.inviteObj){
            var channelName=data.data.channel;
            var obj=data.inviteObj;
            var message=stickyChat.getInviteMessage(obj.name,obj.title,obj.Url,obj.type);
            var dataID=stickyChat.getDataId(channelName);
            SendMessage(dataID,channelName,message)    
        }

    }

    function onFailedSubmitChat(error,data){
        stickyChat.disableToConnect(data.data);
    }

    function inviteMessage(recruiterId,jobId,obj,interViewType,link,applicationId,jobTitle){
        var userId=obj[0].userID;
        var channelName=baseDomain+"--r"+recruiterId+'-j'+userId;
        if(!store.getCandidateFromStoreViaChannel(channelName)){
            var inviteObj={
                type:interViewType,
                Url:link,
                name:obj[0].name,
                title:jobTitle
            };
            createNewChannel(recruiterId,jobId,applicationId,obj,inviteObj);
            return
        }
        var message=stickyChat.getInviteMessage(obj[0].name,jobTitle,link,interViewType)
        var dataID=stickyChat.getDataId(channelName);
        if(window.innerWidth <= 768) {
            window.location.href = staticEndPoints['chat']+'?candidateId='+obj[0].userID+''
            return
        }
        var obj=store.getCandidateFromStoreViaChannel(channelName);
        var scrollToBottom=0;
        if(window.innerWidth>768){
            stickyChat.openChatBox(channelName,obj);
        }
        chatEngine.fetchHistory(channelName,20, null, null, function(data,response){
            onFetchHistory(response,obj,channelName,scrollToBottom)
        });
        stickyChat.scrollEvent(channelName,obj,function(channelName,startTime){
            scrollToBottom=1;
            chatEngine.fetchHistory(channelName,20,startTime, null, function(data,response){
                onFetchHistory(response,obj,channelName,scrollToBottom)
            });
        });
        SendMessage(dataID,channelName,message);
    }

    return{
        inviteMessage:inviteMessage,
        createNewChannel:createNewChannel,
        init:init
    }
}
