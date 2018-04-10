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
		$('.post_job_form').removeClass("hidden");
		$('.guidelines-container').removeClass("hidden");
		$('.premium_job_section').removeClass("hidden");
		$('.submit-action-buttons').removeClass("hidden");
		$('.loader-container').addClass("hidden");
	}
	fetchJobTags(recruiterId)
 	function onSuccessfulSubmitJob(topic, data){
		var jobPostMessage;
		$('#submitForm').addClass('hidden')
		$('.spinner').removeClass('hidden')
		if(type=='edit') {
			jobPostMessage = "Job updated successfully";
		}
		else {
			jobPostMessage = "Job posted successfully";
		}

		// alert("You have successfully posted your job.Our team is reviewing your job and it usually takes upto 24 hours for a job to get published.")
		if(profile["availableCredits"] > 0)
			return window.location.href = "/my-jobs?jobPostMessage="+encodeURIComponent(jobPostMessage)+"";
		window.location.href = "/recruiter/recruiter-plan?jobPostMessage="+encodeURIComponent(jobPostMessage)+""
 	}

	function onFailedSubmitJob(topic, data) {
		errorHandler(data)
	}
	function onSuccessfulFetchJob(topic, data) {
		jobDetails.setData(jobId,data[0]);
	}

	function onFailedFetchJob(topic, data){
		errorHandler(data)
	}

	function onSuccessfulFetchJobTags(topic, data) {
		jobDetails.populateJobTags(data)
	}

	function onFailedFetchJobTags(topic, data) {
		errorHandler(data)
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

function errorHandler(data) {
    var res = data.responseJSON
    if(!res) {
        return toastNotify(3, "Something went wrong");
    }
    return toastNotify(3, res.message);
}
