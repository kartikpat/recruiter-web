var initialLoad = 1;
var globalParameters = {
    pageContent: 10,
    pageNumber: 1,
    status: ""
}
var length;
jQuery(document).ready( function() {

    // fetching url parameters
    var urlParams = fetchURL();
    var jobId = urlParams.pathname.split("/")[2];

    function getTitleFormat(title, regex) {
		return title.replace(regex, '');
	}

    var filters = Filters();
    filters.init();
    filters.addFilterData('industry', industryTagsData);
    filters.addFilterData('functionalArea',functionalAreaTagsData)
    filters.addFilterData('institute', instituteTagsData)
    filters.addFilterData('currentLocation', currentLocationTagsData)
    filters.addFilterData('language', languageTagsData)
    filters.addFilterData('preferredLocation', prefeLocationTagsData);
    filters.onClickApplyFilterButton(function(name){
        filters.setAppliedFilters(name);
        var parameters = filters.getAppliedFilters();
        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;
        parameters.status = globalParameters.status;
        return fetchJobApplications(jobId, parameters, recruiterId)
    });
    filters.onClickRemoveFilter(function(element){
        filters.removeFilter(element);
        var parameters = filters.getAppliedFilters();
        debugger
        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;
        parameters.status = globalParameters.status;
        return fetchJobApplications(jobId, parameters, recruiterId);
    })
    filters.onClickSearchButton(function(){
        var str = filters.getSearchString();
        var parameters = filters.getAppliedFilters();
        debugger
        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;
        parameters.status = globalParameters.status;
        parameters.searchString = str;
        return fetchJobApplications(jobId, parameters, recruiterId);
    })

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
    var theJob = Job();
    var store = Store();

    theJob.setConfig("availableCredits", profile["availableCredits"]);
    candidates.init();
    theJob.init();
    aCandidate.init();

    candidates.onClickCandidate(openSingleCandidate);
    function openSingleCandidate(candidateId){
        var candidateDetails = store.getCandidateFromStore(candidateId);
        aCandidate.showCandidateDetails(candidateDetails);
    }

    candidates.onClickCandidateOtherActions();
    theJob.onClickJobOtherActions();

    candidates.onClickAddTag(function(candidateId) {
        var candidateDetails = store.getCandidateFromStore(candidateId);
        aCandidate.showCandidateDetails(candidateDetails, "tag");

    })

    candidates.onClickAddComment(function(candidateId) {
        var candidateDetails = store.getCandidateFromStore(candidateId);
        aCandidate.showCandidateDetails(candidateDetails, "comment");

    })

    candidates.onClickSendMessage(function(candidateId){
        alert(candidateId)
    })

    candidates.onChangeCandidateCheckbox(function(candidateId){
        alert(candidateId)
    })

    theJob.onClickJobCancel(openUnpublishModal)
    function openUnpublishModal(jobId){
        alert(jobId)
        trackEventCancelButtonClick();
    }

    theJob.onClickJobRefresh(openRefreshModal)
    function openRefreshModal(jobId) {
        alert(jobId)
    }

    theJob.onClickJobMakePremium(openPremiumModal)
    function openPremiumModal(jobId){
        alert(jobId)
    }

    theJob.onChangeDefaultCalendar(setDefaultCalendar)
    function setDefaultCalendar(calendarId) {
        alert(calendarId)
        //postRequestDefaultCalendar
    }

    candidates.createJobStatsTabs(onClickTab)
    function onClickTab(event, ui) {
        var status = candidates.activateStatsTab(event, ui)
        globalParameters["status"] = status;
        globalParameters["pageNumber"] = 1;
        fetchJobApplications(jobId, globalParameters,recruiterId);
    }

    candidates.onClickSendInterviewInvite(sendInterviewInvite);
    function sendInterviewInvite(candidateId, applicationId) {
        var defaultCalendarId = theJob.getDefaultCalendar();
        if(!defaultCalendarId)
            theJob.showCalendarMissingError();
        // if(!(defaultCalendarId && candidateId && applicationId ))
        //     return alert('Please provide all values');
        // postInterviewInvite()
     }

     candidates.onClickDownloadResume(function(candidateId){
         alert(candidateId)
     });

     candidates.onClickSaveJob(function(candidateId){
         alert(candidateId)
     })

     candidates.onClickShortlistCandidate(function(candidateId){
         alert(candidateId)
     })

     candidates.onClickRejectCandidate(function(candidateId){
         alert(candidateId)
     })

     aCandidate.onClickAddTag(function(candidateId){
         alert(candidateId)
     })

     aCandidate.onClickAddComment(function(candidateId){
         alert(candidateId)
     })

    function onJobsApplicationsFetchSuccess(topic, data) {
        //Call only on initial load
        if(initialLoad) {
            candidates.setJobStats(data["stats"]);
            initialLoad = 0;
        }

        length = data["data"].length;
        candidates.addToList(data["data"], globalParameters["status"]);
        store.emptyStore(data["data"]);
        store.saveToStore(data["data"]);
    }

	function onJobsApplicationsFetchFail(topic, data){
		console.log(topic)
		console.log(data)
	}

    function onSuccessfulFetchJobDetails(topic, data) {
        fetchJobApplications(jobId,globalParameters,recruiterId);
        theJob.setJobDetails(data);
    }

    function onFailedFetchJobDetails(topic, data) {
        console.log(topic)
		console.log(data)
    }

    var fetchJobDetailsSubscription = pubsub.subscribe("fetchedJobDetails:"+jobId, onSuccessfulFetchJobDetails)
	var fetchJobDetailsFailSubscription = pubsub.subscribe("failedToFetchJobDetails:"+jobId, onFailedFetchJobDetails);
    var fetchJobApplicationsSuccessSubscription = pubsub.subscribe("fetchedJobApplication:"+jobId, onJobsApplicationsFetchSuccess)
    var fetchJobApplicationsFailSubscription = pubsub.subscribe("failedTofetchJobApplication:"+jobId, onJobsApplicationsFetchFail)

    var ticker;
    $(window).scroll(function() {
     clearTimeout(ticker);
     ticker = setTimeout(checkScrollEnd,100);
    });

    function checkScrollEnd() {
    	if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
    		globalParameters["pageNumber"] = globalParameters["pageNumber"] + 1;
    		if(globalParameters["pageNumber"] != 1 && length == globalParameters["pageContent"]) {
    			fetchJobApplications(jobId,globalParameters,recruiterId)
    		}
    	}
    }

});
