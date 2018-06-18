var globalParameters = {
    pageContent: 10,
    pageNumber: 1,
    offset:0,
    candidateListLength: null
}

jQuery(document).ready( function() {
    var candidates = candidateList();
    candidates.init();
    var chatModule=chatModelIndex();
    var searchQuery = getQueryParameter("searchQuery");
    var parameters = {}
    parameters.pageNumber = globalParameters.pageNumber;
    parameters.pageContent = globalParameters.pageContent;

    if(searchQuery != "")
        parameters.searchString = searchQuery;

    globalSearch(recruiterId, parameters)

    function onFetchCandidatesSuccess(topic,res) {
        hideLoader()
        if(res.data.length==0){
            candidates.setHeader(0, searchQuery)
            return;
        }
        globalParameters.candidateListLength = res.data.length;
        candidates.addToList(res.data,globalParameters.offset,globalParameters.pageContent)
        candidates.setHeader(res.stats.total, searchQuery)
    }

    function onFetchCandidatesFail(topic, res) {
        errorHandler(res)
    }

    var fetchCandidatesSuccessSubscription = pubsub.subscribe('fetchedSearch', onFetchCandidatesSuccess)
	var fetchCandidatesFailSubscription = pubsub.subscribe('fetchedFailSearch', onFetchCandidatesFail)

    var ticker;
    $(window).scroll(function() {
       clearTimeout(ticker);
       ticker = setTimeout(checkScrollEnd,100);
    });

    function checkScrollEnd() {
    	if($(window).scrollTop() + $(window).height() > $(document).height() - 600) {
    		globalParameters.pageNumber = globalParameters.pageNumber + 1;
    		if(globalParameters.pageNumber != 1 && globalParameters.candidateListLength == globalParameters.pageContent) {

                var parameters = {}
                parameters.pageNumber = globalParameters.pageNumber;
                parameters.pageContent = globalParameters.pageContent;

                if(searchQuery != "")
                    parameters.searchString = searchQuery;

                showLoader()
                globalSearch(recruiterId, parameters)
    		}
    	}
    }

})

function errorHandler(data) {
    var res = data.responseJSON
    if(!res) {
        return toastNotify(3, "Looks like you are not connected to the internet");
    }
    if(data.status == 503) {
        toastNotify(3, "Oops...something went wrong. Our engineers are fixing the issue");
         return
    }
    return toastNotify(3, res.message);
}
