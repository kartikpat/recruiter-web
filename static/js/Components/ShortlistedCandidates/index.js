var globalParameters = {
    pageContent: 10,
    pageNumber: 1,
    status: "1,3",
    candidateListLength: null,
    jobId: -1
}
jQuery(document).ready( function() {
    var candidates = candidateList();
    candidates.init();
    var parameters = {}
    parameters.status = globalParameters.status;
    parameters.pageNumber = globalParameters.pageNumber;
    parameters.pageContent = globalParameters.pageContent;
    var chatModule=chatModelIndex();
    var jobParameters = {}
    jobParameters.type = "everPublished";
    fetchJobs(jobParameters, recruiterId)
    fetchCandidatesByStatus(parameters, recruiterId)

    candidates.onFilterByStatus(function(){
        var eventObj = {
            event_category: eventMap["filterShortlisted"]["cat"],
            event_label: 'origin=SavedShorlistedList,Type=CandidateStatus,recId='+recruiterId+''
        }
        sendEvent(eventMap["filterShortlisted"]["event"], eventObj)
        var obj = candidates.getAppliedFilters();
        var parameters = {}
        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;
        parameters.status = obj.status
        candidates.emptyCandidateList()
        candidates.showShell()

        if(parseInt(obj.jobId) == -1) {

            return fetchCandidatesByStatus(parameters, recruiterId)
        }
        fetchJobApplications(obj.jobId,parameters,recruiterId)
    })

    candidates.onFilterByJob(function(){
        var eventObj = {
            event_category: eventMap["filterShortlisted"]["cat"],
            event_label: 'origin=SavedShorlistedList,Type=Job,recId='+recruiterId+''
        }
        sendEvent(eventMap["filterShortlisted"]["event"], eventObj)
        var obj = candidates.getAppliedFilters();
        var parameters = {}
        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;
        parameters.status = obj.status
        candidates.emptyCandidateList()
        candidates.showShell()
        if(parseInt(obj.jobId) == -1) {
            return fetchCandidatesByStatus(parameters, recruiterId)
        }
        fetchJobApplications(obj.jobId,parameters,recruiterId)
    })

    function onFetchCandidatesByStatusSuccess(topic,res) {
        hideLoader()
        globalParameters.candidateListLength = res.data.length
        if(res.stats) {
            if(res.obj.status == "1,3") {
                candidates.showCandidateCount(res.stats.shortlisted + res.stats.save);
            }
            else if(res.obj.status == "1") {
                candidates.showCandidateCount(res.stats.shortlisted);
            }
            else if(res.obj.status == "3"){
                candidates.showCandidateCount(res.stats.save);
            }
        }
        else {
            candidates.showCandidateCount(0)
        }

        candidates.addToList(res.data, globalParameters.pageNumber, globalParameters.pageContent)
    }

    function onFetchCandidatesByStatusFail(topic, res) {
        errorHandler(data)
    }

    function onJobsFetchSuccess(topic, data) {
		candidates.populateJobsDropdown(data);
	}

	function onJobsFetchFail(topic, data){
        errorHandler(data)
	}

    var fetchCandidatesByStatusSuccessSubscription = pubsub.subscribe('fetchCandidatesByStatusSuccess', onFetchCandidatesByStatusSuccess)
	var fetchCandidatesByStatusFailSubscription = pubsub.subscribe('fetchCandidatesByStatusFail', onFetchCandidatesByStatusFail)

    var fetchJobSuccessSubscription = pubsub.subscribe('fetchedJobs', onJobsFetchSuccess)
	var fetchJobFailSubscription = pubsub.subscribe('fetchJobsFail', onJobsFetchFail)

    var fetchJobApplicationsSuccessSubscription = pubsub.subscribe("fetchedJobApplication", onFetchCandidatesByStatusSuccess)
    var fetchJobApplicationsFailSubscription = pubsub.subscribe("failedTofetchJobApplication", onFetchCandidatesByStatusFail)

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
                parameters.status = obj.status
                showLoader()
                if(parseInt(obj.jobId) == -1) {
                    return fetchCandidatesByStatus(parameters, recruiterId)
                }
    			fetchJobApplications(obj.jobId,parameters,recruiterId)
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
