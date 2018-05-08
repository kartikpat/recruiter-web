$(document).ready(function(){

	var jobDetails = Job();

	jobDetails.init();

	if(jobId) {
		fetchJob(jobId, recruiterId)
    }

	function onSuccessfulFetchJobDetails(topic, data) {
		jobDetails.setData(jobId,data[0]);
	}

	function onFailedFetchJobDetails(topic, data){
		errorHandler(data)
	}

    var fetchJobDetailsSubscription = pubsub.subscribe("fetchedJob:"+jobId+"", onSuccessfulFetchJobDetails)
    var fetchJobDetailsFailSubscription = pubsub.subscribe("failedToFetchJob:"+jobId+"", onFailedFetchJobDetails);

})

function errorHandler(data) {
	if(data.status == 401) {
        return window.location = staticEndPoints.dashboard
    }
    var res = data.responseJSON
	if(!res) {
        return toastNotify(3, "Looks like you are not connected to the internet");
    }
    return toastNotify(3, res.message);
}
