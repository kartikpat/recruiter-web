$(document).ready(function(){
	var jobDetails = Job();
	jobDetails.init();
	jobDetails.submitHandler(function(){
			if(jobDetails.validate())
				submitNewJob(jobDetails.getData());
		})
	function onSuccessfulSubmitJob(topic, data){
		console.log(topic)
		console.log(data);

	}
	var jobSubmitSuccessSubscription = pubsub.subscribe('submittedNewJob', onSuccessfulSubmitJob);
	var jobSubmitFailSubscription = pubsub.subscribe('failedNewJobSubmission')
})