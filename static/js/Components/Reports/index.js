jQuery(document).ready( function() {
    var reports = reportList();

    reports.init();
    reports.setConfig("recruiterId", recruiterId)
    fetchRecruiterReports(recruiterId)

    reports.onClickDownloadExcelButton(function(){
        return toastNotify(1, "An Email has been sent with the download link!")
        // downloadMassResume(recruiterId)
    })

    function onFetchReportsSuccess(topic, data) {
        console.log(data)
    
        reports.addToList(data);
    }

    function onFetchReportsFail(topic, data) {
        errorHandler(data)
    }

    function onDownloadSuccess(topic, res) {
        return toastNotify(1, "An Email has been sent with the download link!")
    }

    function onDownloadFail(topic, res) {
        errorHandler(res)
    }

    var fetchReportsSuccessSubscription = pubsub.subscribe('fetchReportsSuccess', onFetchReportsSuccess)
	var fetchReportsFailSubscription = pubsub.subscribe('fetchReportsFail', onFetchReportsFail)

    var downloadSuccessSubscription = pubsub.subscribe("downloadedSuccess", onDownloadSuccess)
    var downloadFailSubscription = pubsub.subscribe("downloadedFail", onDownloadFail)
})

function errorHandler(data) {
    if(!data) {
        return toastNotify(3, "Something went wrong");
    }
    return toastNotify(3, data.message);
}
