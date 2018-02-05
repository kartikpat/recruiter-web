
var initialLoad = 1;
jQuery(document).ready( function() {

    var urlObject = fetchURL();

    var res = urlObject["pathname"].split("/");

    if(!(isNaN(res[2]))){
	    var jobId = res[2];
	}

	var candidateList = Candidates();

    var aCandidate = Candidate();

	fetchJobApplications(jobId,"");

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
