jQuery(document).ready( function() {
    var reports = reportList();

    reports.init();
    reports.setConfig("recruiterId", recruiterId)
    reports.setHref()
    fetchRecruiterReports(recruiterId)



    function onFetchReportsSuccess(topic, data) {
        console.log(data)

        reports.addToList(data);
    }

    function onFetchReportsFail(topic, data) {
        errorHandler(data)
    }



    var fetchReportsSuccessSubscription = pubsub.subscribe('fetchReportsSuccess', onFetchReportsSuccess)
	var fetchReportsFailSubscription = pubsub.subscribe('fetchReportsFail', onFetchReportsFail)

})

function errorHandler(data) {
    if(!data) {
        return toastNotify(3, "Something went wrong");
    }
    return toastNotify(3, data.message);
}
