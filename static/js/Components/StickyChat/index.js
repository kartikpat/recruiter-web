var channelsArray = []
    
$(document).ready(function(){
    var chatEngine = ChatEngine(recruiterId, profile.email);
    chatEngine.initialize();
    chatEngine.addListeners(onNewMessage, onNewPresence, onNewStatus);
    var stickyChat=stickyChatModule();
    stickyChat.init();   
    fetchRecruiterChats(recruiterId)

    stickyChat.onClickStickyChat(function(channelName,messageNumber,dataID){
        var obj = stickyChat.getCandidateFromStore(dataID)
        chatEngine.fetchHistory(channelName,messageNumber, null, null, function(data,response){
            onFetchHistory(data, response,obj,channelName)
        });
    })

    stickyChat.onClickSidebarChat(function(channelName,messageNumber,dataID){
        var obj = stickyChat.getCandidateFromStore(dataID)
        chatEngine.fetchHistory(channelName,messageNumber, null, null, function(data,response){
            onFetchHistory(data, response,dataID,obj,channelName)
        });
    })

    function onFetchHistory(data, response,obj,channelName) {
        stickyChat.populateMessages(response,obj,channelName.channel)
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
        stickyChat.receiveMessage(m);
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