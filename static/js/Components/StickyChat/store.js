
function chatStoreModel(){
    var chatStore={};
    function saveToStore(dataArray){
        dataArray.forEach(function(anObj) {
            chatStore[anObj["userId"]] = anObj;
            chatStore[anObj["channel"]]=anObj;
        })
    }

    function getCandidateFromStore(candidateId){
        return chatStore[candidateId]
    }

    function getCandidateFromStoreViaChannel(channelName){
        return chatStore[channelName];
    }
    return {
		saveToStore: saveToStore,
		getCandidateFromStore: getCandidateFromStore,
		getCandidateFromStoreViaChannel:getCandidateFromStoreViaChannel
	}
}    