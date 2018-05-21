var globalParameters = {
    pageContent: 10,
    pageNumber: 1,
    tagId: -1,
    candidateListLength: null
}

jQuery(document).ready( function() {
    var candidates = candidateList();
    candidates.init();
    var tagId = getQueryParameter("queryTag");

    if(!isEmpty(tagId)) {
        globalParameters.tagId = tagId
        candidates.setTagId(tagId)
    }

    var parameters = {}
    parameters.pageNumber = globalParameters.pageNumber;
    parameters.pageContent = globalParameters.pageContent;
    if(globalParameters.tagId != -1)
        parameters.tagId = globalParameters.tagId;

    fetchRecruiterTags(recruiterId)
    fetchCandidatesByTags(parameters, recruiterId)

    candidates.onFilterByTag(function(){
        var eventObj = {
            event_category: eventMap["filterTagged"]["cat"],
            event_label: 'origin=TaggedList,recId='+recruiterId+''
        }
        sendEvent(eventMap["filterTagged"]["event"], eventObj)
        var obj = candidates.getAppliedFilters();
        var parameters = {}

        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;
        if(parseInt(obj.tagId) != -1) {
            parameters.tagId = obj.tagId
        }
        candidates.emptyCandidateList()
        candidates.showShell()
        fetchCandidatesByTags(parameters, recruiterId)
    })

    function onFetchCandidatesByTagsSuccess(topic,res) {
        hideLoader()
        globalParameters.candidateListLength = res.data.length
        candidates.addToList(res.data,  globalParameters.pageNumber, globalParameters.pageContent)
    }

    function onFetchCandidatesByTagsFail(topic, res) {
        errorHandler(res)
    }

    function onSuccessfullFetchedTag(topic, res){
        var arr = sortArrayOfObjectsByKey(res.data, "name")
		candidates.populateTagsDropdown(arr);
	}

	function onFailFetchedTag(topic, data){
        errorHandler(data)
	}

    var fetchCandidatesByTagsSuccessSubscription = pubsub.subscribe('fetchCandidatesByTagsSuccess', onFetchCandidatesByTagsSuccess)
	var fetchCandidatesByTagsFailSubscription = pubsub.subscribe('fetchCandidatesByTagsFail', onFetchCandidatesByTagsFail)

    var fetchedTagsSuccessSubscription = pubsub.subscribe("fetchedTags", onSuccessfullFetchedTag)
    var fetchTagsFailSubscription = pubsub.subscribe("fetchTagsFail", onFailFetchedTag)

    var ticker;
    $(window).scroll(function() {
       clearTimeout(ticker);
       ticker = setTimeout(checkScrollEnd,100);
    });

    function checkScrollEnd() {
    	if($(window).scrollTop() + $(window).height() > $(document).height() - 600) {
    		globalParameters.pageNumber = globalParameters.pageNumber + 1;
    		if(globalParameters.pageNumber != 1 && globalParameters.candidateListLength == globalParameters.pageContent) {
                var obj = candidates.getAppliedFilters();
                var parameters = {}
                parameters.pageNumber = globalParameters.pageNumber;
                parameters.pageContent = globalParameters.pageContent;
                parameters.tagId = obj.tagId
                showLoader()
    			fetchCandidatesByTags(parameters,recruiterId)
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
