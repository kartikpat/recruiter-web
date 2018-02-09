var initialLoad = 1;
jQuery(document).ready( function() {

    // fetching url parameters
    var urlParams = fetchURL();

    var jobId = urlParams.pathname.split("/")[2];

    function getTitleFormat(title, regex) {
		return title.replace(regex, '');
	}

    $.when(fetchJob(jobId, recruiterId ), fetchCalendars(jobId, recruiterId)).then(function(a, b){
        if(a[0] && b[0] && a[0]["status"] == "success" && b[0]["status"] =="success" && a[0]['data'].length >0 ) {
            var jobRow = a[0]['data'][0];
            console.log(b)
            var calendarRows = b[0]['data'];

            var data = {
               jobTitle: getTitleFormat(jobRow["title"],(/\(\d+-\d+ \w+\)$/)),
               jobLocation: jobRow["loc"].toString(),
               jobExperience: jobRow["exp"]['min']+'-'+ jobRow['exp']['max'] +' yrs',
               jobId: jobRow['id'],
               jobStatus: jobRow['status'],
               isPremium: jobRow['premium'],
               isEditable: jobRow['editable'],
               calendars: calendarRows
            }
            return pubsub.publish("fetchedJobDetails:"+jobId, data);
        }
        return pubsub.publish("failedToFetchJobDetails:"+jobId, data);
    });

    // initializing the models
	var candidates = candidateList();
    var aCandidate = Candidate();
    var aJob = Job();
    var store = Store();

    candidates.setConfig("availableCredits", profile["availableCredits"]);

    aJob.init()

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
		// candidates.showActions(data[0]);
	}

	function onFailedFetchJob(topic, data){
		alert(res.status)
		console.log(topic)
		console.log(data);
	}

    function onSuccessfulFetchJobDetails(topic, data) {
        fetchJobApplications(jobId,"",recruiterId);
        aJob.setJobDetails(data);
    }


     candidates.onClickSendInterviewInvite(sendInterviewInvite);
     function sendInterviewInvite(candidateId, applicationId){
        var defaultCalendarId = aJob.getDefaultCalendar();
        if(!(defaultCalendarId && candidateId && applicationId ))
            return alert('Please provide all values');
        postInterviewInvite()
     }

    var fetchJobDetailsSubscription = pubsub.subscribe("fetchedJobDetails:"+jobId, onSuccessfulFetchJobDetails)
    var fetchJobSuccessSubscription = pubsub.subscribe("fetchedJob:"+jobId, onSuccessfulFetchJob);
	var fetchJobFailSubscription = pubsub.subscribe("failedToFetchJob:"+jobId, onFailedFetchJob);
    var fetchJobApplicationsSuccessSubscription = pubsub.subscribe("fetchedJobApplication:"+jobId, onJobsApplicationsFetchSuccess)
    var fetchJobApplicationsFailSubscription = pubsub.subscribe("failedTofetchJobApplication:"+jobId, onJobsApplicationsFetchFail)
    // var fetchParallelJobStatusAndCalendarsSubscription = pubsub.subscribe("fetchedParallelJobStatusAndCalendars:"+jobId, onJobStatusAndCalendarsFetchSuccess)
    // var fetchParallelJobStatusAndCalendarsFailSubscription = pubsub.subscribe("failedToFetchParallelJobStatusAndCalendars:"+jobId, onJobStatusAndCalendarsFetchFail)
});
