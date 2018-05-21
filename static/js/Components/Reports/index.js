jQuery(document).ready( function() {
    var reports = reportList();

    reports.init();
    reports.setConfig("recruiterId", recruiterId)
    reports.setHref()
    fetchRecruiterReports(recruiterId)

    function onFetchReportsSuccess(topic, data) {
        reports.addToList(data);
    }

    function onFetchReportsFail(topic, data) {
        errorHandler(data)
    }

    var fetchReportsSuccessSubscription = pubsub.subscribe('fetchReportsSuccess', onFetchReportsSuccess)
	var fetchReportsFailSubscription = pubsub.subscribe('fetchReportsFail', onFetchReportsFail)

})

function errorHandler(data) {
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
