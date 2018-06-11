function StoreModule (){
	var store = {}

	function saveToStore(dataArray){
        dataArray.forEach(function(anObj) {
            store[anObj["id"]] = anObj;
        })
    }

    function emptyStore(){
		store = {};
    }

    function getCandidateFromStore(candidateId){
		return store[candidateId]
    }

	return {
		saveToStore: saveToStore,
		emptyStore: emptyStore,
		getCandidateFromStore: getCandidateFromStore
	}
}
