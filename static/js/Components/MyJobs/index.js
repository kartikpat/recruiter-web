var globalParameters = {
    pageContent: 10,
    pageNumber: 1,
    type: "all",
    jobListLength: null,
    initialLoad: 1
}

jQuery(document).ready( function() {

    var successMsg = getQueryParameter("jobPostMessage");
    if(!isEmpty(successMsg)) {
        toastNotify(1, decodeURIComponent(successMsg))
        var newUrl = removeParam("jobPostMessage", window.location.href)
        window.history.replaceState("object or string", "Title", newUrl);
    }

	var jobList = Jobs();

	jobList.init();

	jobList.setConfig("availableCredits", profile["availableCredits"]);

	jobList.setConfig("baseUrlJob", baseUrlJob);

	jobList.onChangeJobFilters(function(type){
        var eventObj = {
			event_category: eventMap["jobsFilterChange"]["cat"],
			event_label: 'origin=MyJobs,status='+type+',recId='+recruiterId+''
		}
		sendEvent(eventMap["jobsFilterChange"]["event"], eventObj)
		tickerLock = false;
        jobList.hideEmptyView()
		jobList.emptyList();
		jobList.showShell();
		var parameters = {}
		globalParameters.pageNumber = 1;
		parameters.pageNumber = globalParameters.pageNumber;
		parameters.pageContent = globalParameters.pageContent;
		parameters.type = type;
		globalParameters.type = parameters.type;
		fetchJobs(parameters,recruiterId);
	})

	jobList.onClickJobEdit()

	jobList.onClickSubmitUnpublishJob(function(jobId, reason){
        var eventObj = {
			event_category: eventMap["jobUnpublishClick"]["cat"],
			event_label: 'origin=MyJobs,recId='+recruiterId+''
		}
		sendEvent(eventMap["jobUnpublishClick"]["event"], eventObj)
		jobList.showSpinner("unpublish")
		return submitUnpublishJob(recruiterId, jobId, {reasonId: reason});
	});

	jobList.onClickSubmitRefreshJob(function(jobId){
        var eventObj = {
			event_category: eventMap["jobRefreshClick"]["cat"],
			event_label: 'origin=MyJobs,recId='+recruiterId+''
		}
		sendEvent(eventMap["jobRefreshClick"]["event"], eventObj)
		jobList.showSpinner("refresh")
		return submitRefreshJob(recruiterId, jobId);
	})

	jobList.onClickSubmitPremiumJob(function(jobId){

		jobList.showSpinner("premium")
		return submitPremiumJob(recruiterId, jobId);
	})

	//Initial call
	var parameters = {}
	parameters.pageNumber = globalParameters.pageNumber;
	parameters.pageContent = globalParameters.pageContent;
	var initialType = jobList.getType();
	parameters.type = initialType || globalParameters.type;
	fetchJobs(parameters,recruiterId);

	var fetchJobSuccessSubscription = pubsub.subscribe('fetchedJobs', onJobsFetchSuccess)
	var fetchJobFailSubscription = pubsub.subscribe('fetchJobsFail', onJobsFetchFail)
	var unPublishJobSuccessSubscription = pubsub.subscribe("jobUnpublishSuccess", onSuccessfulUnpublishedJob);
	var unPublishJobFailSubscription = pubsub.subscribe("jobUnpublishFail", onFailedUnpublishedJob);

	var refreshJobSuccessSubscription = pubsub.subscribe("jobRefreshSuccess", onSuccessfulRefreshJob)
	var refreshJobFailSubscription = pubsub.subscribe("jobRefreshFail", onFailedRefreshJob)

	var premiumJobSuccessSubscription = pubsub.subscribe("jobPremiumSuccess", onSuccessfulPremiumJob)
	var premiumJobFailSubscription = pubsub.subscribe("jobPremiumFail", onFailedPremiumJob);

	function onJobsFetchSuccess(topic, data){
		hideLoader()
		tickerLock = false;
        globalParameters.initialLoad = 0;
		globalParameters.jobListLength = data.length;

		jobList.addToList(data, globalParameters.pageNumber, globalParameters.pageContent,data.obj.type);
	}

	function onJobsFetchFail(topic, data){
		errorHandler(data)
	}
	function onSuccessfulUnpublishedJob(topic, data) {
		jobList.hideSpinner("unpublish")
        jobList.closeModal()
		toastNotify(1, "Job Unpublish Successfully")
		setTimeout(function(){
			 location.reload()
		 }, 2000);
	}

	function onFailedUnpublishedJob(topic,data) {
        jobList.hideSpinner("unpublish")
		errorHandler(data)
	}
	function onSuccessfulRefreshJob(topic, data){
        jobList.hideSpinner("refresh")
        jobList.closeModal()
		toastNotify(1, "Job Refreshed Successfully")
		setTimeout(function(){
			 location.reload()
		 }, 2000);
	}
	function onFailedRefreshJob(topic, data){
        jobList.hideSpinner("refresh")
		errorHandler(data)
	}
	function onSuccessfulPremiumJob(topic, data){
        jobList.hideSpinner("premium")
        jobList.closeModal()
		toastNotify(1, "Job Made Premium Successfully")
		setTimeout(function(){
			 location.reload()
		 }, 2000);
	}

	function onFailedPremiumJob(topic, data){
        jobList.hideSpinner("premium")
		errorHandler(data)
	}

	var tickerLock=false;
    $(window).scroll(function() {
        if(!tickerLock && !globalParameters.initialLoad){
            tickerLock = true;
            setTimeout(checkScrollEnd,100);
        }
    });

    function checkScrollEnd() {

    	if($(window).scrollTop() + $(window).height() > $(document).height() - 600) {
    		globalParameters.pageNumber = globalParameters.pageNumber + 1;

    		if(globalParameters.jobListLength >= globalParameters.pageContent) {
                var parameters = {}
                parameters.pageNumber = globalParameters.pageNumber;
                parameters.pageContent = globalParameters.pageContent;
                parameters.type = globalParameters.type;
                showLoader()
    			fetchJobs(parameters,recruiterId);
    		}
            else
                tickerLock = false;
    	}
        else{
            tickerLock = false
        }
    }
});

function errorHandler(data) {
    var res = data.responseJSON
    if(!res) {
        return toastNotify(3, "Looks like you are not connected to the internet");
    }
    return toastNotify(3, res.message);
}
