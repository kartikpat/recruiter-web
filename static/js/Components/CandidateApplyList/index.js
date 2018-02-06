var initialLoad = 1;
jQuery(document).ready( function() {
    var urlParams = fetchURL();
    var queryParameters = getQueryParameter(urlParams.search); // fetching the entire query parameters object;

    var jobId = urlParams.pathname.split("/")[2];
    var title = queryParameters.title;

// Deprecated
 //    var res = urlObject["pathname"].split("/");

 //    if(!(isNaN(res[2]))){
	//     var jobId = res[2];
	// }

    // initializing the models
	var candidateList = candidateList();
    var aCandidate = Candidate();

    /**
     * Making the initial page load call.
     * check for status in the queryString
     */
	fetchJobApplications(jobId,"");

    candidateList.onClickCandidate(openSingleCandidate);

    function openSingleCandidate(candidateId){
        // TODO:
        var candidateDetails = store.getCandidate(candidateId);
        aCandidate.showCandidateDetails(candidateDetails);
    }

    aCandidate.onClickShowDetails();

    candidateList.createJobStatsTabs(onClickTab)

    function onClickTab(event, ui) {
        var status = candidateList.activateStatsTab(event, ui)
        fetchJobApplications(jobId, status);
    }

    function onJobsApplicationsFetchSuccess(topic, data) {
        if(initialLoad) {
            candidateList.setJobStats(data["stats"]);
            initialLoad = 0;
        }
        candidateList.add(data["data"]);
        aCandidate.emptyStore(data["data"]);
        aCandidate.saveToStore(data["data"]);
    }

	function onJobsApplicationsFetchFail(topic, data){
		console.log(topic)
		console.log(data)
	}

    var fetchJobApplicationsSuccessSubscription = pubsub.subscribe("fetchedJobApplication:"+jobId, onJobsApplicationsFetchSuccess)
    var fetchJobApplicationsFailSubscription = pubsub.subscribe("failedTofetchJobApplication:"+jobId, onJobsApplicationsFetchFail)

});

function getQueryParameter(){

}

function fetchURL(){

}