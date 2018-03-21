var globalParameters = {
    pageContent: 10,
    pageNumber: 1,
    status: "1,3",
    candidateListLength: null
}

jQuery(document).ready( function() {
 
   var slots = BookedSlots();

   slots.init();

   fetchRecruiterCalendar(recruiterId)

   slots.onChangeCalendarFilters(function(calendarId){
       slots.showShell();
       var parameters = {};
       globalParameters.pageNumber = 1;
       parameters.pageNumber = globalParameters.pageNumber;
       parameters.pageContent = globalParameters.pageContent;
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

   var parameters = {}
   parameters.pageNumber = globalParameters.pageNumber;
   parameters.pageContent = globalParameters.pageContent;
   //Initial call
   fetchInterviews(recruiterId, parameters);

   var fetchedInterviewsSuccessSubscription = pubsub.subscribe('fetchedInterviews', onInterviewsFetchSuccess)
   var fetchedInterviewsFailSubscription = pubsub.subscribe('fetchedInterviewsFail', onInterviewsFetchFail)
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
       slots.addToList(data);
   }

   function onInterviewsFetchFail(topic, data){

   }

   function onSuccessfulPremiumJob(topic, data){
       slots.hideLoaderOverlay()
       toastNotify(1, "Job Made Premium Successfully")
       setTimeout(function(){
            location.reload()
        }, 2000);
   }
   function onFailedPremiumJob(topic, data){
       slots.hideLoaderOverlay()
       slots.openModal("premium")
       errorHandler(data)
   }

});

function errorHandler(data) {
    if(!data) {
        return toastNotify(3, "Something went wrong");
    }
    return toastNotify(3, data.message);
}
