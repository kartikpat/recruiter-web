var initialLoad = 1;
jQuery(document).ready( function() {
    // fetching url parameters
    var urlParams = fetchURL();
    var queryParameters = getQueryParameter();
    var jobId = urlParams.pathname.split("/")[2];

    // initializing the models
	var candidates = candidateList();
    var aCandidate = Candidate();
    var store = Store();

    candidates.setConfig("availableCredits", profile["availableCredits"]);
    candidates.init(queryParameters)

    /**
     * Making the initial page load call.
     * check for status in the queryString
     */
    //fetchCalendars(jobId)
    // $.when(fetchJob(jobId), fetchCalendars(jobId)).then(function(a, b){
    //     if(a[1] && b[1]) {
    //         var data = {
    //             "JobStats": a[0],
    //             "calendars" b[0]
    //         }
    //         pubsub.publish("fetchedParallelJobStatusAndCalendars:"+jobId, data);
    //         return
    //     }
    //     pubsub.publish("failedToFetchParallelJobStatusAndCalendars:"+jobId, data);
    // });

    fetchJob(jobId);
	fetchJobApplications(jobId,"");

    candidates.onClickCandidate(openSingleCandidate);
    function openSingleCandidate(candidateId){
        var candidateDetails = store.getCandidateFromStore(candidateId);
        aCandidate.showCandidateDetails(candidateDetails);
    }

    candidates.onClickCandidateOtherActions();
    candidates.onClickFilters();
    candidates.onClickJobOtherActions();

    candidates.onClickAddTag(openAddTagModal);
    function openAddTagModal() {
        alert("added");
    }

    candidates.onClickAddComment();
    function openAddCommentModal() {
        alert("added");
    }

    candidates.onClickJobCancel(openUnpublishModal)
    function openUnpublishModal(jobId){
        alert(jobId)
        trackEventCancelButtonClick();
    }

    candidates.onClickJobRefresh(openRefreshModal)
    function openRefreshModal(jobId) {
        alert(jobId)
    }

    candidates.onClickJobMakePremium(openPremiumModal)
    function openPremiumModal(jobId){
        alert(jobId)
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
    // var fetchParallelJobStatusAndCalendarsSubscription = pubsub.subscribe("fetchedParallelJobStatusAndCalendars:"+jobId, onJobStatusAndCalendarsFetchSuccess)
    // var fetchParallelJobStatusAndCalendarsFailSubscription = pubsub.subscribe("failedToFetchParallelJobStatusAndCalendars:"+jobId, onJobStatusAndCalendarsFetchFail)
});
