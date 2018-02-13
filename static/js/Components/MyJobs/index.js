var status = "all";
jQuery(document).ready( function() {
	var jobList = Jobs();

	jobList.init()
	jobList.setConfig("availableCredits", profile["availableCredits"]);

	jobList.onChangeJobFilters(function(type){
		status = type;
		fetchJobs(status,recruiterId);
	})

	jobList.onClickJobEdit()

	jobList.onClickJobCancel(function(jobId){
		alert(jobId)
	})

	jobList.onClickJobRefresh(function(jobId) {
		alert(jobId)
	})

	jobList.onClickJobMakePremium(function(jobId){
		alert(jobId)
	})

	//Initial call
	fetchJobs(status,recruiterId);

	var fetchJobSuccessSubscription = pubsub.subscribe('fetchedJobs', onJobsFetchSuccess)
	var fetchJobFailSubscription = pubsub.subscribe('fetchJobsFail', onJobsFetchFail)
	// var unPublishJobSuccessSubscription = pubsub.subscribe("unPublishedJob", onSuccessfulUnpublishedJob);
	// var unPublishJobFailSubscription = pubsub.subscribe("unPublishedJobFail", onFailedUnpublishedJob);

	function onJobsFetchSuccess(topic, data){
		jobList.addToList(data);
	}

	function onJobsFetchFail(topic, data){

	}

	// function onSuccessfulUnpublishedJob(topic, data) {
	// 	alert(data)
	// }
	//
	// function onFailedUnpublishedJob(topic,data) {
	// 	alert(data)
	// }

});
