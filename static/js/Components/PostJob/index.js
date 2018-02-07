var jobId = getUrlParameter("jobId");
$(document).ready(function(){

	var jobDetails = Job();
	jobDetails.init();
	console.log(profile)
	jobDetails.setAvailableCredits(profile["availableCredits"]);
	jobDetails.submitHandler(function(){
			if(jobDetails.validate())
				submitNewJob(jobDetails.getData());
		})
	if(jobId) {
		fetchJob(jobId);
	}
 	function onSuccessfulSubmitJob(topic, data){
		alert(res.status)
		console.log(topic)
		console.log(data);

	}
	function onFailedSubmitJob(topic, data){
		alert(res.status)
		console.log(topic)
		console.log(data);

	}
	function onSuccessfulFetchJob(topic, data) {
		console.log(topic)
		console.log(data);
		jobDetails.setData(jobId,data[0]);
	}
	function onFailedFetchJob(topic, data){
		alert(res.status)
		console.log(topic)
		console.log(data);

	}
	var fetchJobSuccessSubscription = pubsub.subscribe("fetchedJob:"+jobId, onSuccessfulFetchJob);
	var fetchJobFailSubscription = pubsub.subscribe("failedToFetchJob:"+jobId, onFailedFetchJob);
	var jobSubmitSuccessSubscription = pubsub.subscribe('submittedNewJob', onSuccessfulSubmitJob);
	var jobSubmitFailSubscription = pubsub.subscribe('failedNewJobSubmission', onFailedSubmitJob)
})
