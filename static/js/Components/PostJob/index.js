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
		var eventObj = {
			event_category: eventMap["postJobClick"]["cat"],
			event_label: 'origin=PostJobForm,recId='+recruiterId+''
		}
		sendEvent( eventMap["postJobClick"]["event"], eventObj)
		if(jobDetails.validate()){
			spinner();
			if(jobId)
				submitEditJob(recruiterId ,jobId,jobDetails.getData())
			else
				submitNewJob(jobDetails.getData(), recruiterId);
		}
	})
	if(jobId) {
		fetchJob(jobId, recruiterId);
		$('.post_job_form').removeClass("hidden");
		$('.guidelines-container').removeClass("hidden");
		$('.premium_job_section').removeClass("hidden");
		$('.submit-action-buttons').removeClass("hidden");
		$('.loader-container').addClass("hidden");
	}
	fetchJobTags(recruiterId)

 	function onSuccessfulSubmitJob(topic, data){
		var jobPostMessage;
		spinner();
		if(type=='edit') {
			jobPostMessage = "Job updated successfully";
		}
		else {
			jobPostMessage = "Job posted successfully";
		}
		if(profile["availableCredits"] > 0)
			return window.location.href = staticEndPoints.myJobs + "?jobPostMessage="+encodeURIComponent(jobPostMessage)+"";
		window.location.href = staticEndPoints.plans + "?jobPostMessage="+encodeURIComponent(jobPostMessage)+"&jobId="+data["data"]+""
 	}

	function onFailedSubmitJob(topic, data) {
		errorHandler(data)
		togglespinner();
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
	if(data.status == 401) {
        return window.location = staticEndPoints.dashboard;
    }
    var res = data.responseJSON
	if(!res) {
        return toastNotify(3, "Looks like you are not connected to the internet");
    }
    return toastNotify(3, res.message);
}

function spinner(){
	$('#submitForm').addClass('hidden')
	$('.spinner').removeClass('hidden')
}

function togglespinner(){
	$('#submitForm').removeClass('hidden')
	$('.spinner').addClass('hidden')
}
