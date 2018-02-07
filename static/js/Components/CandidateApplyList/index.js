var initialLoad = 1;
jQuery(document).ready( function() {

    var urlParams = fetchURL();
    var queryParameters = getQueryParameter();

    var jobId = urlParams.pathname.split("/")[2];
    // populate title location exp

    // initializing the models
	var candidates = candidateList();
    var aCandidate = Candidate();
    var store = Store();

    candidates.init(queryParameters)
    /**
     * Making the initial page load call.
     * check for status in the queryString
     */
    fetchJob(jobId);
	fetchJobApplications(jobId,"");

    candidates.onClickCandidate(openSingleCandidate);

    function openSingleCandidate(candidateId){
        var candidateDetails = store.getCandidateFromStore(candidateId);
        aCandidate.showCandidateDetails(candidateDetails);
    }


    candidates.createJobStatsTabs(onClickTab)

    function onClickTab(event, ui) {
        var status = candidates.activateStatsTab(event, ui)
        fetchJobApplications(jobId, status);
    }

    function onJobsApplicationsFetchSuccess(topic, data) {
        //Call only on initial load
        if(initialLoad) {
            candidates.setJobStats(data["stats"]);
            initialLoad = 0;
        }
        candidates.addToList(data["data"]);
        store.emptyStore(data["data"]);
        store.saveToStore(data["data"]);
    }

	function onJobsApplicationsFetchFail(topic, data){
		console.log(topic)
		console.log(data)
	}

    function onSuccessfulFetchJob(topic, data) {
		console.log(topic)
		console.log(data);
		candidates.showActions(data[0]);
	}
	function onFailedFetchJob(topic, data){
		alert(res.status)
		console.log(topic)
		console.log(data);

	}

    var fetchJobSuccessSubscription = pubsub.subscribe("fetchedJob:"+jobId, onSuccessfulFetchJob);
	var fetchJobFailSubscription = pubsub.subscribe("failedToFetchJob:"+jobId, onFailedFetchJob);
    var fetchJobApplicationsSuccessSubscription = pubsub.subscribe("fetchedJobApplication:"+jobId, onJobsApplicationsFetchSuccess)
    var fetchJobApplicationsFailSubscription = pubsub.subscribe("failedTofetchJobApplication:"+jobId, onJobsApplicationsFetchFail)


});
