var globalParameters = {
    pageContent: 10,
    pageNumber: 1,
    status: "",
    candidateListLength: null
}
jQuery(document).ready( function() {
    var candidates = candidateList();

    candidates.init();
    var parameters = {}
    parameters.status = globalParameters.status;
    parameters.pageNumber = globalParameters.pageNumber;
    parameters.pageContent = globalParameters.pageContent;

    fetchJobs("", recruiterId)
    fetchCandidatesByStatus(jobId, parameters, recruiterId)

    candidates.onFilterByStatus(function(status){
        var parameters = {}
        parameters.status = status;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;
        return alert(status)
        fetchCandidatesByStatus(jobId, parameters, recruiterId)
    })

    candidates.onFilterByJob(function(jobId){
        var parameters = {}
        parameters.status = jobId; 
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;
        return alert(jobId)
        fetchCandidatesByStatus(jobId, parameters, recruiterId)
    })

    function onFetchCandidatesByStatusSuccess(topic,res) {
        candidates.showCandidateCount(200)
        candidates.addToList(res.data)
    }

    function onFetchCandidatesByStatusFail(topic, res) {
        alert(res)
    }

    function onJobsFetchSuccess(topic, data){

		candidates.populateJobsDropdown(data);
	}

	function onJobsFetchFail(topic, data){

	}

    var fetchCandidatesByStatusSuccessSubscription = pubsub.subscribe('fetchCandidatesByStatusSuccess', onFetchCandidatesByStatusSuccess)
	var fetchCandidatesByStatusFailSubscription = pubsub.subscribe('fetchCandidatesByStatusFail', onFetchCandidatesByStatusFail)

    var fetchJobSuccessSubscription = pubsub.subscribe('fetchedJobs', onJobsFetchSuccess)
	var fetchJobFailSubscription = pubsub.subscribe('fetchJobsFail', onJobsFetchFail)

})
