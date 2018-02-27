var globalParameters = {
    pageContent: 10,
    pageNumber: 1,
    status: "",
    candidateListLength: null
}
jQuery(document).ready( function() {
    var candidates = candidateList();

    var tagId = getQueryParameter("queryTag");
    if(tagId) {
        candidates.setTagId(tagId)
    }
    candidates.init();

    var parameters = {}

    parameters.status = globalParameters.status;
    parameters.pageNumber = globalParameters.pageNumber;
    parameters.pageContent = globalParameters.pageContent;

    fetchRecruiterTags(recruiterId)
    fetchCandidatesByStatus(jobId, parameters, recruiterId)

    candidates.onFilterByTag(function(status){
        var parameters = {}
        parameters.status = status;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;
        return alert(status)
        fetchCandidatesByStatus(jobId, parameters, recruiterId)
    })

    function onFetchCandidatesByStatusSuccess(topic,res) {
        candidates.addToList(res.data)
    }

    function onFetchCandidatesByStatusFail(topic, res) {
        alert(res)
    }

    function onSuccessfullFetchedTag(topic, res){

		candidates.populateTagsDropdown(res.data);
	}

	function onFailFetchedTag(topic, data){

	}

    var fetchCandidatesByStatusSuccessSubscription = pubsub.subscribe('fetchCandidatesByStatusSuccess', onFetchCandidatesByStatusSuccess)
	var fetchCandidatesByStatusFailSubscription = pubsub.subscribe('fetchCandidatesByStatusFail', onFetchCandidatesByStatusFail)

    var fetchedTagsSuccessSubscription = pubsub.subscribe("fetchedTags", onSuccessfullFetchedTag)
    var fetchTagsFailSubscription = pubsub.subscribe("fetchTagsFail", onFailFetchedTag)

})
