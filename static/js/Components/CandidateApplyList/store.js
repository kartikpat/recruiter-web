function Store (){
	var store = {}

	function saveToStore(dataArray){
        dataArray.forEach(function(anObj) {
            store[anObj["userID"]] = anObj;
        })
    }

    function emptyStore(){
		store = {};
    }

    function getCandidateFromStore(candidateId){
		return store[candidateId]
		}
		function updateCandidate(props, candidateId){
			/* props = {
				comment: comment,
				tags: []
			}
			*/
			if(store[candidateId] && props.comment){
				store[candidateId]["comment"]= props.comment;
			};
		}

	return {
		saveToStore: saveToStore,
		emptyStore: emptyStore,
		getCandidateFromStore: getCandidateFromStore,
		updateCandidate: updateCandidate
	}
}
