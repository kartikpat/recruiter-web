var test = null;
$(document).ready(function(){
    var calendarDetails = Calendar();
    calendarDetails.init();
    calendarDetails.startdate();
    calendarDetails.enddate();
    calendarDetails.time_mapper();
    test= calendarDetails.testHighlight;
     console.log(calendarId);
 
    if(calendarId){
        fetchCalendars(calendarId,recruiterId);
        $('.form-container').removeClass('hidden');
        $('.Availability').removeClass('hidden');
        $('.second-container ').removeClass('hidden');
        $('.bottom-container ').removeClass('hidden');
        $('.loaderScroller').addClass("hidden");
    }
    calendarDetails.submitHandler(function(){
        if(calendarDetails.validate()){
        var data=calendarDetails.getDetails();
        submitCalendar(data,calendarId,recruiterId);
        }
    })

    function onSuccessfulFetchCalendar(topic,data){
        console.log(data);
        calendarDetails.setDetails(data);
    }

    function onFailedFetchCalendar(topic,data){
        alert(res.status);
    }

    function onSuccessfulSubmitCalendar(topic, data){
        console.log('submit successful');
        console.log(data);
        window.location='/calendar-manage' //changeurl
    }

	function onFailedSubmitCalendar(topic, data){
		console.log('Login failed');
		calendarDetails.errorHandler(data);
    }

    var calendarSubmitSuccessSubscription = pubsub.subscribe('submittedCalendar',onSuccessfulSubmitCalendar);
    var calendarSubmitFailSubscription = pubsub.subscribe('failedCalendarSubmission',onFailedSubmitCalendar);
  
    var fetchCalendarSuccessSubscription = pubsub.subscribe("fetchedCalendars",onSuccessfulFetchCalendar);
	var fetchCalendarFailSubscription = pubsub.subscribe("failedToFetchCalendars",onFailedFetchCalendar);
 
})    
