

var chatStore=[];

function chatStoreModel(){
    
    function saveToStore(dataArray){
        dataArray.forEach(function(anObj) {
            chatStore[anObj["userId"]] = anObj;
            chatStore[anObj["channel"]]=anObj;
        })
    }

    function updateStore(anObj){
        debugger
        chatStore[anObj["userID"]] = anObj;
        chatStore[anObj["channel"]]=anObj;
        chatStore.push(chatStore[anObj["userID"]]);
        chatStore.push(chatStore[anObj["channel"]]);
        console.log(chatStore)
    }

    function getCandidateFromStore(candidateId){
        return chatStore[candidateId]
    }

    function getCandidateFromStoreViaChannel(channelName){
        return chatStore[channelName];
    }
    
    function getStore(){
        return chatStore;
    }

    return {
		saveToStore: saveToStore,
		getCandidateFromStore: getCandidateFromStore,
		getCandidateFromStoreViaChannel:getCandidateFromStoreViaChannel,
        getStore:getStore,
        updateStore:updateStore
    }
}    

