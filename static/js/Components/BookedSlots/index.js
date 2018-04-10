var globalParameters = {
    pageContent: 10,
    pageNumber: 1,
    InterviewListLength: null,
    calendarId: -1
}

jQuery(document).ready( function() {
   var slots = BookedSlots();
   slots.init();

   fetchRecruiterCalendar(recruiterId)

   slots.onChangeCalendarFilters(function(calendarId){
       slots.emptySlots();
       slots.showShell();
       var parameters = {};
       globalParameters.pageNumber = 1;
       parameters.pageNumber= globalParameters.pageNumber;
       parameters.pageContent= globalParameters.pageContent;
       if(slots.getStartDate() != '') {
           parameters.fromDate = slots.getStartDate();
       }
       if(parseInt(calendarId) != -1) {
           parameters.calendarId = parseInt(calendarId);
           globalParameters.calendarId = parameters.calendarId;
       }
       fetchInterviews(recruiterId, parameters);
   })

   slots.onClickSubmitCancelInterview(function(inviteId, calendarId, applicationId, reason, jobId){
       slots.closeModal()
       slots.showLoaderOverlay()
       var data = {
           inviteId: parseInt(inviteId),
           calendarId: parseInt(calendarId),
           block: reason
       }
       return cancelInterviewInvite(recruiterId, jobId, applicationId, data);
   });

    function onChangeDate(){
        slots.emptySlots();
        slots.showShell();
       var parameters = {};
       globalParameters.pageNumber = 1;
       parameters.pageNumber= globalParameters.pageNumber;
       parameters.pageContent= globalParameters.pageContent;
       if(slots.getStartDate() != '') {
           parameters.fromDate = slots.getStartDate();
       }
       if(globalParameters.calendarId != -1) {
           parameters.calendarId = globalParameters.calendarId;
       }
       fetchInterviews(recruiterId, parameters);
    }

    slots.startdate(function(){
        onChangeDate()
    })


   var parameters = {}
   parameters.pageNumber = globalParameters.pageNumber;
   parameters.pageContent = globalParameters.pageContent;
   //Initial call
   fetchInterviews(recruiterId, parameters);

   var fetchedInterviewsSuccessSubscription = pubsub.subscribe('fetchedInterviews',onInterviewsFetchSuccess)
   var fetchedInterviewsFailSubscription = pubsub.subscribe('fetchedInterviewsFail',onInterviewsFetchFail)

   var cancelInviteSuccessSubscription = pubsub.subscribe("cancelInviteSuccess", onSuccessfulCancelInvite);
   var cancelInviteFailSubscription = pubsub.subscribe("cancelInviteFail", onFailedCancelInvite);

   var fetchedCalendarsSuccessSubscription = pubsub.subscribe("fetchedCalendars", onSuccessfullFetchedCalendars)
   var fetchCalendarsFailSubscription = pubsub.subscribe("failedToFetchCalendars", onFailFetchedCalendars)

   function onSuccessfullFetchedCalendars(topic, res){
       slots.populateCalendarDropdown(res.data);
   }

   function onFailFetchedCalendars(topic, data){

   }

   function onInterviewsFetchSuccess(topic, data){
        tickerLock = false;
        globalParameters.InterviewListLength = data.length;
        slots.addToList(data,globalParameters.pageNumber,globalParameters.pageContent);
    }

   function onInterviewsFetchFail(topic, data){

   }

   function onSuccessfulCancelInvite(topic, data){
       slots.hideLoaderOverlay()
       toastNotify(1, "Interview Invite Cancelled Successfully")
       setTimeout(function(){
            location.reload()
        }, 2000);
   }

   function onFailedCancelInvite(topic, data){
       slots.hideLoaderOverlay()
       slots.openModal()
       errorHandler(data)
   }

   var tickerLock=false;
   $(window).scroll(function() {
       if(!tickerLock){
           tickerLock = true;
           setTimeout(checkScrollEnd,100);
       }
   });

   function checkScrollEnd() {
       if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {

           globalParameters.pageNumber = globalParameters.pageNumber + 1;
           if(globalParameters.InterviewListLength >= globalParameters.pageContent) {

               parameters.pageNumber = globalParameters.pageNumber;
               parameters.pageContent = globalParameters.pageContent;
               if(slots.getStartDate() != '') {
                   parameters.fromDate = slots.getStartDate();
               }
               if(globalParameters.calendarId != -1) {
                   parameters.calendarId = globalParameters.calendarId;
               }
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
    var res = data.responseJSON
    hideLoader()
    if(!res) {

        return toastNotify(3, "Something went wrong");
    }
    return toastNotify(3, res.message);
}
