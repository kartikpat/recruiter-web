var status = "all";
jQuery(document).ready( function() {
	var jobList = Jobs();

	jobList.init();
	jobList.setConfig("availableCredits", profile["availableCredits"]);
	jobList.setConfig("baseUrlJob", baseUrlJob);
	jobList.onChangeJobFilters(function(type){
		status = type;
		fetchJobs(status,recruiterId);
	})

	jobList.onClickJobEdit()

	jobList.onClickSubmitUnpublishJob(function(jobId, reason){
		return submitUnpublishJob(recruiterId, jobId, {reasonId: reason});
	});
	jobList.onClickSubmitRefreshJob(function(jobId){
		return submitRefreshJob(recruiterId, jobId);
	})
	// jobList.onClickJobCancel(function(jobId){
	// 	alert(jobId)
	// })

	// jobList.onClickJobRefresh(function(jobId) {
	// 	alert(jobId)
	// })

	// jobList.onClickJobMakePremium(function(jobId){
	// 	alert(jobId)
	// })
	jobList.onClickSubmitPremiumJob(function(jobId){
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
		alert(topic)
	}
	
	function onFailedUnpublishedJob(topic,data) {
		alert(topic)
	}
	function onSuccessfulRefreshJob(topic, data){
		alert(topic);
	}
	function onFailedRefreshJob(topic, data){
		alert(topic);
	}
	function onSuccessfulPremiumJob(topic, data){
		alert(topic)
	}
	function onFailedPremiumJob(topic, data){
		alert(topic);
	}

});
