$(document).ready(function(){

	var jobDetails = Job();

	jobDetails.init();

	if(jobId) {
		fetchJob(jobId, recruiterId)
    }

	function onSuccessfulFetchJobDetails(topic, data) {
		console.log(data[0])
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
	if(data.status == 503) {
        toastNotify(3, "Oops...something went wrong. Our engineers are fixing the issue");
         return
    }
    return toastNotify(3, res.message);
}
