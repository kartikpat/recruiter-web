function Store (){

	// Replace $.each with forEach
	function saveToStore(dataArray){
        $.each(dataArray, function(index, anObj) {
            store[anObj["userID"]] = anObj;
        })
    }

    function emptyStore(){

    }

    function getCandidate(candidateId){
    	
    }
}