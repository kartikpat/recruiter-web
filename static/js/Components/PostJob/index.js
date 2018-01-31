var jobId = getUrlParameter("jobId");
$(document).ready(function(){

	var jobDetails = Job();
	jobDetails.init();
	jobDetails.submitHandler(function(){
			if(jobDetails.validate())
				submitNewJob(jobDetails.getData());
		})
	if(jobId) {
		jobDetails.setData(jobId);
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
	var jobSubmitSuccessSubscription = pubsub.subscribe('submittedNewJob', onSuccessfulSubmitJob);
	var jobSubmitFailSubscription = pubsub.subscribe('failedNewJobSubmission', onFailedSubmitJob)
})
