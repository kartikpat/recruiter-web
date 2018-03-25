function Store (){
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

		function updateCandidate(props, candidateId){
			/* props = {
				comment: comment,
				tags: []
			}
			*/
			
			if(store[candidateId] && props.comment){
				store[candidateId]["comment"]= props.comment;
			};
			if(store[candidateId] && (props.status || props.status ==0)){
				store[candidateId]['status'] = props.status;
			}
		}

	return {
		saveToStore: saveToStore,
		emptyStore: emptyStore,
		getCandidateFromStore: getCandidateFromStore,
		updateCandidate: updateCandidate
	}
}
