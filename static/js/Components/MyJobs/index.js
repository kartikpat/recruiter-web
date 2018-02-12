jQuery(".header .menu-list-item.my-jobs").addClass("active");
jQuery(document).ready( function() {
	var jobList = Jobs();
	fetchJobs(status,recruiterId);
	jobList.setConfig("availableCredits", profile["availableCredits"]);

	jobList.onChangeJobFilters(openFiltersOptions)
	function openFiltersOptions(type) {
		status = type;
		fetchJobs(status,recruiterId);
	}

	jobList.onClickJobEdit()
	jobList.onClickJobCancel(openUnpublishJobModal)
	function openUnpublishJobModal(jobId){
		alert(jobId)
		// unPublishJob(jobId)
		trackEventCancelButtonClick();
	}
	jobList.onClickJobRefresh(openRefreshJobModal)
	function openRefreshJobModal(jobId) {
		alert(jobId)
	}
	jobList.onClickJobMakePremium(openMakeJobPremiumModal)
	function openMakeJobPremiumModal(jobId){
		alert(jobId)
	}

	var fetchJobSuccessSubscription = pubsub.subscribe('fetchedJobs:', onJobsFetchSuccess)
	var fetchJobFailSubscription = pubsub.subscribe('fetchJobsFail', onJobsFetchFail)
	var unPublishJobSuccessSubscription = pubsub.subscribe("unPublishedJob", onSuccessfulUnpublishedJob);
	var unPublishJobFailSubscription = pubsub.subscribe("unPublishedJobFail", onFailedUnpublishedJob);

	function onJobsFetchSuccess(topic, data){
		console.log(topic)
		console.log(data)
		jobList.init(data);
	}

	function onJobsFetchFail(topic, data){
		console.log(topic)
		console.log(data)
	}

	function onSuccessfulUnpublishedJob(topic, data) {
		alert(data)
	}

	function onFailedUnpublishedJob(topic,data) {
		alert(data)
	}

});
