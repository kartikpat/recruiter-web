$(document).ready(function(){

	var jobDetails = Job();
	jobDetails.setConfig("availableCredits", profile["availableCredits"]);
	jobDetails.init();


	jobDetails.onChangeJobPremium(function(){
		alert("hi")
	})
	jobDetails.submitHandler(function(){
			if(jobDetails.validate())
				submitNewJob(jobDetails.getData());
		})
	if(jobId) {
		fetchJob(jobId);
	}
 	function onSuccessfulSubmitJob(topic, data){
		// alert("You have successfully posted your job.Our team is reviewing your job and it usually takes upto 24 hours for a job to get published.")
		if(profile["availableCredits"] > 0)
			return window.location.href = "/dashboard";
		window.location.href = "/recruiter/recruiter-plan"
 		console.log(topic)
		console.log(data);

	}
	function onFailedSubmitJob(topic, data){
		alert(res.status)
	}
	function onSuccessfulFetchJob(topic, data) {
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
