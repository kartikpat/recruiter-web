$(document).ready(function(){
    var resume=MassResume();
    resume.init();
    //fetchRecruiterReports(recruiterId);    

    function onFetchResumeSuccess(topic, data) {
        resume.addToList(data);
    }

    function onFetchResumeFail(topic, data) {
        errorHandler(data)
    }

    var fetchResumeSuccessSubscription = pubsub.subscribe('fetchResumeSuccess', onFetchResumeSuccess)
	var fetchResumeFailSubscription = pubsub.subscribe('fetchResumeFail', onFetchResumeFail)

})