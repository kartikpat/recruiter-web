$(document).ready(function(){

	var jobDetails = Job();

	jobDetails.init();

    function getTitleFormat(title, regex) {
        return title.replace(regex, '');
    }

    function getLocation(arr) {
        var array = []
        arr.forEach(function(value, index){
           for(var locCategory in cityList) {
               if(cityList[locCategory][value]) {
                   var locName = cityList[locCategory][value];
                   array.push(locName)
               }
           }
       })
       return array;
    }

	if(jobId) {
        $.when(fetchJob(jobId, recruiterId), fetchJobTags(recruiterId)).then(function(a,b){
            if(a[0] && a[0]["status"] == "success" && b[0] && b[0]["status"] == "success") {
                var jobRow = a[0]['data'][0];
                var jobTags = b[0]['data'];
                var data = {
                  jobTitle: jobRow["title"],
                  jobLocation: getLocation(jobRow["location"]),
                  jobExperience: jobRow["exp"]['min']+ ' - ' + jobRow['exp']['max'] +' yrs',
                  jobPublishedId: jobRow['publishedId'],
                  jobId: jobRow['id'],
                  jobTags: jobTags
               }
                return pubsub.publish("fetchedJobDetails", data);
            }
            return pubsub.publish("failedToFetchJobDetails", a[0]["status"]);
        })

	}

	function onSuccessfulFetchJobDetails(topic, data) {
		jobDetails.setData(jobId,data[0]);
	}

	function onFailedFetchJobDetails(topic, data){
		errorHandler(data)
	}

    var fetchJobDetailsSubscription = pubsub.subscribe("fetchedJobDetails", onSuccessfulFetchJobDetails)
    var fetchJobDetailsFailSubscription = pubsub.subscribe("failedToFetchJobDetails", onFailedFetchJobDetails);

})

function errorHandler(data) {
	if(data.status == 401) {
        return window.location = "/"
    }
    var res = data.responseJSON
	if(!res) {
        return toastNotify(3, "Looks like you are not connected to the internet");
    }
    return toastNotify(3, res.message);
}
