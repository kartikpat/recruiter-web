var globalParameters = {
    pageContent: 10,
    pageNumber: 1,
    candidateListLength: null
}

jQuery(document).ready( function() {
    var candidates = candidateList();
    candidates.init();
    var searchQuery = getQueryParameter("searchQuery");
    
    var parameters = {}
    parameters.pageNumber = globalParameters.pageNumber;
    parameters.pageContent = globalParameters.pageContent;
    if(searchQuery != "")
        parameters.query = searchQuery;

    fetchCandidatesByTags(parameters, recruiterId)

    function onFetchCandidatesByTagsSuccess(topic,res) {
        candidates.addToList(res.data)
        candidates.setHeader(res.data.length, searchQuery)
    }

    function onFetchCandidatesByTagsFail(topic, res) {
        alert(res)
    }

    var fetchCandidatesByTagsSuccessSubscription = pubsub.subscribe('fetchCandidatesByTagsSuccess', onFetchCandidatesByTagsSuccess)
	var fetchCandidatesByTagsFailSubscription = pubsub.subscribe('fetchCandidatesByTagsFail', onFetchCandidatesByTagsFail)


    var ticker;
    $(window).scroll(function() {
       clearTimeout(ticker);
       ticker = setTimeout(checkScrollEnd,100);
    });

    function checkScrollEnd() {
    	if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
    		globalParameters.pageNumber = globalParameters.pageNumber + 1;
    		if(globalParameters.pageNumber != 1 && globalParameters.candidateListLength == globalParameters.pageContent) {

                var parameters = {}
                parameters.pageNumber = globalParameters.pageNumber;
                parameters.pageContent = globalParameters.pageContent;


    			fetchCandidatesByTags(parameters,recruiterId)
    		}
    	}
    }

})
