var globalParameters = {
    pageContent: 10,
    pageNumber: 1,
 }


$(document).ready(function(){
    var resume=MassResume();
    resume.init();

    //initial call
    var parameters = {}
	parameters.pageNumber = globalParameters.pageNumber;
	parameters.pageContent = globalParameters.pageContent;
    fetchRecruiterResume(recruiterId);   
    
    

    function onFetchResumeSuccess(topic, data) {
        resume.addToList(data,parameters);
    }

    function onFetchResumeFail(topic, data) {
        errorHandler(data)
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
    			fetchRecruiterResume(recruiterId); 
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