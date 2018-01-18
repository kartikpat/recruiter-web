$(document).ready(function(){
	var submitButton = submitButton();
	submitButton.click(function(e){
		var jobDetails = Job;
		jobDetails.init();
		if(jobDetails.validate())
			submitNewJob(jobDetails.getData());
	});
	function onSuccessfulSubmitJob(topic, data){
		console.log(topic)
		console.log(data);
		
	}
	var jobSubmitSuccessSubscription = pubsub.subscribe('submittedNewJob', onSuccessfulSubmitJob);
	var jobSubmitFailSubscription = pubsub.subscribe('failedNewJobSubmission')
})