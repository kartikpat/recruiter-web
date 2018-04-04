var globalParameters = {
    pageContent: 10,
    pageNumber: 1,
    status: "1,3",
    candidateListLength: null,
    startdate:'03/12/2018'
}

jQuery(document).ready( function() {
   var slots = BookedSlots();
   slots.init();

   fetchRecruiterCalendar(recruiterId)

   slots.onChangeCalendarFilters(function(calendarId){
       slots.showShell();
       var parameters = {};
       globalParameters.pageNumber = 1;
       parameters.pageNumber= globalParameters.pageNumber;
       parameters.pageContent= globalParameters.pageContent;
    //    parameters.from=slots.getStartDate();
       slots.emptySlots();
       if(calendarId != -1) {
           parameters.calendarId = calendarId;
       }
       fetchInterviews(recruiterId, parameters);
   })

   slots.onClickSubmitCancelInterview(function(jobId, reason){
       slots.closeModal()
       slots.showLoaderOverlay()
       return submitUnpublishJob(recruiterId, jobId, {reasonId: reason});
   });

    function onChangeDate(){
       var parameters = {};
       parameters.pageNumber= globalParameters.pageNumber;
       parameters.pageContent= globalParameters.pageContent;
       parameters.from=slots.getStartDate();
       if(calendarId != -1) {
             parameters.calendarId = calendarId;
       }
       console.log(parameters);
       slots.emptySlots();
       fetchInterviews(recruiterId, parameters);
    }

    slots.startdate(function(){
        console.log("fff");
        onChangeDate()
    })


   var parameters = {}
   parameters.pageNumber = globalParameters.pageNumber;
   parameters.pageContent = globalParameters.pageContent;
   //Initial call
   fetchInterviews(recruiterId, parameters);

   var fetchedInterviewsSuccessSubscription = pubsub.subscribe('fetchedInterviews',onInterviewsFetchSuccess)
   var fetchedInterviewsFailSubscription = pubsub.subscribe('fetchedInterviewsFail',onInterviewsFetchFail)
   // var unPublishJobSuccessSubscription = pubsub.subscribe("jobUnpublishSuccess", onSuccessfulUnpublishedJob);
   // var unPublishJobFailSubscription = pubsub.subscribe("jobUnpublishFail", onFailedUnpublishedJob);

   var fetchedCalendarsSuccessSubscription = pubsub.subscribe("fetchedCalendars", onSuccessfullFetchedCalendars)
   var fetchCalendarsFailSubscription = pubsub.subscribe("failedToFetchCalendars", onFailFetchedCalendars)

   function onSuccessfullFetchedCalendars(topic, res){
       slots.populateCalendarDropdown(res.data);
   }

   function onFailFetchedCalendars(topic, data){

   }


   function onInterviewsFetchSuccess(topic, data){
        tickerLock = false;
        console.log(data);
        globalParameters.InterviewListLength = data.length;
        slots.addToList(data,globalParameters.pageNumber,globalParameters.pageContent);

    }

   function onInterviewsFetchFail(topic, data){

   }

//    function onSuccessfulPremiumJob(topic, data){
//        slots.hideLoaderOverlay()
//        toastNotify(1, "Job Made Premium Successfully")
//        setTimeout(function(){
//             location.reload()
//         }, 2000);
//    }
//    function onFailedPremiumJob(topic, data){
//        slots.hideLoaderOverlay()
//        slots.openModal("premium")
//        errorHandler(data)
//    }

   var tickerLock=false;
   $(window).scroll(function() {
       if(!tickerLock){
           tickerLock = true;
           setTimeout(checkScrollEnd,100);
       }
   });

   function checkScrollEnd() {
       if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
        //    debugger
           globalParameters.pageNumber = globalParameters.pageNumber + 1;
           if(globalParameters.InterviewListLength >= globalParameters.pageContent) {
            //    var parameters = filters.getAppliedFilters();
               parameters.pageNumber = globalParameters.pageNumber;
               parameters.pageContent = globalParameters.pageContent;
               parameters.status = globalParameters.status;
               $(".loaderScroller").removeClass("hidden");
               fetchInterviews(recruiterId,parameters);
           }
           else
               tickerLock = false;
       }
       else{
           tickerLock = false
       }
   }

});

function errorHandler(data) {
    if(!data) {
        return toastNotify(3, "Something went wrong");
    }
    return toastNotify(3, data.message);
}
