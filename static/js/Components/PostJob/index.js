$(document).ready(function(){

	var jobDetails = Job();
	jobDetails.setConfig("availableCredits", profile["availableCredits"]);
	var type = 'post'
	if(jobId)
		type='edit';
	jobDetails.init(type);

	jobDetails.onChangeJobPremium(function(){
		alert("hi")
	})
	jobDetails.submitHandler(function(){
		if(jobDetails.validate()){
			if(jobId)
				submitEditJob(recruiterId ,jobId,jobDetails.getData())
			else
				submitNewJob(jobDetails.getData(), recruiterId);
		}
	})
	if(jobId) {
		fetchJob(jobId);
	}
	fetchJobTags(recruiterId)
 	function onSuccessfulSubmitJob(topic, data){
		if(type=='edit') {
			localStorage.setItem("jobPostSuccessMessage", "Job updated successfully");
		}
		else {
			localStorage.setItem("jobPostSuccessMessage", "Job posted successfully");
		}

		// alert("You have successfully posted your job.Our team is reviewing your job and it usually takes upto 24 hours for a job to get published.")
		if(profile["availableCredits"] > 0)
			return window.location.href = "/my-jobs";
		window.location.href = "/recruiter/recruiter-plan"
 		console.log(topic)
		console.log(data);

	}
	function onFailedSubmitJob(topic, data) {
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

	function onSuccessfulFetchJobTags(topic, data) {
		jobDetails.populateJobTags(data)
	}

	function onFailedFetchJobTags(topic, data) {
		console.log(data)
	}

	var fetchJobSuccessSubscription = pubsub.subscribe("fetchedJob:"+jobId, onSuccessfulFetchJob);
	var fetchJobFailSubscription = pubsub.subscribe("failedToFetchJob:"+jobId, onFailedFetchJob);

	var fetchJobTagsSuccessSubscription = pubsub.subscribe("fetchedJobTags", onSuccessfulFetchJobTags);
	var fetchJobTagsFailSubscription = pubsub.subscribe("failToFetchJobTags", onFailedFetchJobTags);

	var jobSubmitSuccessSubscription = pubsub.subscribe('submittedNewJob', onSuccessfulSubmitJob);
	var jobSubmitFailSubscription = pubsub.subscribe('failedNewJobSubmission', onFailedSubmitJob);
	var jobEditSuccessSubscription = pubsub.subscribe('jobEdited', onSuccessfulSubmitJob);
	var jobEditFailSubscription = pubsub.subscribe('failedEditJobSubmission', onFailedSubmitJob);
	bindGuidelineModalFunctionality();
})
