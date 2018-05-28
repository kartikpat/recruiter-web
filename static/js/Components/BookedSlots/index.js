var globalParameters = {
    pageContent: 10,
    pageNumber: 1,
    InterviewListLength: null,
    calendarId: -1,
    fromDate: (moment().format("YYYY-MM-DD")) + ":00:00:00"
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
       globalParameters.calendarId = calendarId;
       if(slots.getStartDate() != '') {
           globalParameters.fromDate = slots.getStartDate();
       }
       parameters.fromDate = globalParameters.fromDate;
       if(parseInt(calendarId) != -1) {
           var eventObj = {
               event_category: eventMap["filterSlots"]["cat"],
               event_label: 'origin=BookedSlots,Type=Date,recId='+recruiterId+''
           }
           sendEvent(eventMap["filterSlots"]["event"], eventObj)
           parameters.calendarId = parseInt(calendarId);
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
           globalParameters.fromDate = slots.getStartDate();
       }
       parameters.fromDate = globalParameters.fromDate;
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
   parameters.fromDate = globalParameters.fromDate;

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
        hideLoader()
        slots.hideShell()
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
               parameters.fromDate = globalParameters.fromDate;
               if(globalParameters.calendarId != -1) {
                   parameters.calendarId = globalParameters.calendarId;
               }
               showLoader()

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
        return toastNotify(3, "Looks like you are not connected to the internet");
    }
    if(data.status == 503) {
        toastNotify(3, "Oops...something went wrong. Our engineers are fixing the issue");
         return
    }
    return toastNotify(3, res.message);
}
