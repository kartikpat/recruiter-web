
var globalParameters = {
    pageContent: 10,
    pageNumber: 1,
 }

$(document).ready(function(){
    var resume=MassResume();
    resume.init();
    var parameters = {}
	parameters.pageNumber = globalParameters.pageNumber;
	parameters.pageContent = globalParameters.pageContent;
    fetchRecruiterResume(recruiterId);   
    
    function onFetchResumeSuccess(topic,data) {
        console.log(data);
        resume.addToList(data);
    }

    function onFetchResumeFail(data) {
        console.log(data);
    }

    function checkScrollEnd() {
    	if($(window).scrollTop() + $(window).height() > $(document).height() - 600) {
    		globalParameters.pageNumber = globalParameters.pageNumber + 1;

    		if(globalParameters.jobListLength >= globalParameters.pageContent) {
                var parameters = {}
                parameters.pageNumber = globalParameters.pageNumber;
                parameters.pageContent = globalParameters.pageContent;
                parameters.type = globalParameters.type;
                showLoader()
    			fetchRecruiterResume(recruiterId,parameters); 
    		}
            else
                tickerLock = false;
    	}
        else{
            tickerLock = false
        }
    }

    var fetchResumeSuccessSubscription = pubsub.subscribe('fetchResumeSuccess', onFetchResumeSuccess)
	var fetchResumeFailSubscription = pubsub.subscribe('fetchResumeFail', onFetchResumeFail)

})