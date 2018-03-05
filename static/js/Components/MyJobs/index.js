var status = "all";
jQuery(document).ready( function() {
	var jobList = Jobs();

	jobList.init();
	jobList.setConfig("availableCredits", profile["availableCredits"]);
	jobList.setConfig("baseUrlJob", baseUrlJob);
	jobList.onChangeJobFilters(function(type){
		jobList.showShell();
		status = type;
		fetchJobs(status,recruiterId);
	})

	jobList.onClickJobEdit()

	jobList.onClickSubmitUnpublishJob(function(jobId, reason){
		jobList.closeModal()
		jobList.showLoaderOverlay()
		return submitUnpublishJob(recruiterId, jobId, {reasonId: reason});
	});
	jobList.onClickSubmitRefreshJob(function(jobId){
		jobList.closeModal()
		jobList.showLoaderOverlay()
		return submitRefreshJob(recruiterId, jobId);
	})

	jobList.onClickSubmitPremiumJob(function(jobId){
		jobList.closeModal()
		jobList.showLoaderOverlay()
		return submitPremiumJob(recruiterId, jobId);
	})

	//Initial call
	fetchJobs(status,recruiterId);

	var fetchJobSuccessSubscription = pubsub.subscribe('fetchedJobs', onJobsFetchSuccess)
	var fetchJobFailSubscription = pubsub.subscribe('fetchJobsFail', onJobsFetchFail)
	var unPublishJobSuccessSubscription = pubsub.subscribe("jobUnpublishSuccess", onSuccessfulUnpublishedJob);
	var unPublishJobFailSubscription = pubsub.subscribe("jobUnpublishFail", onFailedUnpublishedJob);

	var refreshJobSuccessSubscription = pubsub.subscribe("jobRefreshSuccess", onSuccessfulRefreshJob)
	var refreshJobFailSubscription = pubsub.subscribe("jobRefreshFail", onFailedRefreshJob)

	var premiumJobSuccessSubscription = pubsub.subscribe("jobPremiumSuccess", onSuccessfulPremiumJob)
	var premiumJobFailSubscription = pubsub.subscribe("jobPremiumFail", onFailedPremiumJob);

	function onJobsFetchSuccess(topic, data){
		jobList.addToList(data);
	}

	function onJobsFetchFail(topic, data){

	}
	function onSuccessfulUnpublishedJob(topic, data) {
		jobList.hideLoaderOverlay()
		toastNotify(1, "Job Unpublish Successfully")
		setTimeout(function(){
			 location.reload()
		 }, 2000);
	}

	function onFailedUnpublishedJob(topic,data) {
		jobList.hideLoaderOverlay()
		jobList.openModal("unpublish")
		errorHandler(data)
	}
	function onSuccessfulRefreshJob(topic, data){
		jobList.hideLoaderOverlay()
		toastNotify(1, "Job Refreshed Successfully")
		setTimeout(function(){
			 location.reload()
		 }, 2000);
	}
	function onFailedRefreshJob(topic, data){
		jobList.hideLoaderOverlay()
		jobList.openModal("refresh")
		errorHandler(data)
	}
	function onSuccessfulPremiumJob(topic, data){
		jobList.hideLoaderOverlay()
		toastNotify(1, "Job Made Premium Successfully")
		setTimeout(function(){
			 location.reload()
		 }, 2000);
	}
	function onFailedPremiumJob(topic, data){
		jobList.hideLoaderOverlay()
		jobList.openModal("premium")
		errorHandler(data)
	}

});

function errorHandler(data) {
    if(!data) {
        return toastNotify(3, "Something went wrong");
    }
    return toastNotify(3, data.message);
}
