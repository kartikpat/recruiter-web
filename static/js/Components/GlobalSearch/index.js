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
        parameters.searchString = searchQuery;

    globalSearch(recruiterId, parameters)

    function onFetchCandidatesSuccess(topic,res) {
        candidates.addToList(res.data)
        candidates.setHeader(res.data.length, searchQuery)
    }

    function onFetchCandidatesFail(topic, res) {
        errorHandler(res)
    }

    var fetchCandidatesSuccessSubscription = pubsub.subscribe('fetchedSearch', onFetchCandidatesSuccess)
	var fetchCandidatesFailSubscription = pubsub.subscribe('fetchedFailSearch', onFetchCandidatesFail)

    // var ticker;
    // $(window).scroll(function() {
    //    clearTimeout(ticker);
    //    ticker = setTimeout(checkScrollEnd,100);
    // });
    //
    // function checkScrollEnd() {
    // 	if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
    // 		globalParameters.pageNumber = globalParameters.pageNumber + 1;
    // 		if(globalParameters.pageNumber != 1 && globalParameters.candidateListLength == globalParameters.pageContent) {
    //
    //             var parameters = {}
    //             parameters.pageNumber = globalParameters.pageNumber;
    //             parameters.pageContent = globalParameters.pageContent;
    //
    // 			fetchCandidatesByTags(parameters,recruiterId)
    // 		}
    // 	}
    // }

})

function errorHandler(data) {
    var res = data.responseJSON
    if(!res) {
        return toastNotify(3, "Looks like you are not connected to the internet");
    }
    return toastNotify(3, res.message);
}
