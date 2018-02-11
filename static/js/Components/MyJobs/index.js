jQuery(".header .menu-list-item.my-jobs").addClass("active");

jQuery(document).ready( function() {
	var jobList = Jobs();
	fetchJobs(recruiterId);
	jobList.setConfig("availableCredits", profile["availableCredits"]);
	var fetchJobSuccessSubscription = pubsub.subscribe('fetchedJobs:all', onJobsFetchSuccess)
	var fetchJobFailSubscription = pubsub.subscribe('fetchJobsFail', onJobsFetchFail)
	var unPublishJobSuccessSubscription = pubsub.subscribe("unPublishedJob", onSuccessfulUnpublishedJob);
	var unPublishJobFailSubscription = pubsub.subscribe("unPublishedJobFail", onFailedUnpublishedJob);

	function onJobsFetchSuccess(topic, data){
		console.log(topic)
		console.log(data)
		jobList.init(data);
		jobList.onClickJobEdit()
		jobList.onClickJobCancel(function(jobId){
			alert(jobId)
			// unPublishJob(jobId)
			trackEventCancelButtonClick();
		});
		jobList.onClickJobRefresh(function(jobId){
			alert(jobId)
		});
		jobList.onClickJobMakePremium(function(jobId){
			alert(jobId)
		});
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
