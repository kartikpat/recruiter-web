var test = null;
$(document).ready(function(){
    var calendarDetails = Calendar();
    calendarDetails.init();
    calendarDetails.startdate();
    calendarDetails.enddate();
    calendarDetails.time_mapper();
    test= calendarDetails.testHighlight;
  //  fetchCalendars("159","33765");
    calendarDetails.submitHandler(function(){
        if(calendarDetails.validate()){
        var data=calendarDetails.getDetails();
        submitCalendar(data,"159","33765");
        }
    })

    function onSuccessfulFetchCalendar(topic,data){
        console.log("hie here");
        console.log(data);
        calendarDetails.setDetails(data);
    }

    function onFailedFetchCalendar(topic,data){
        alert(res.status);
    }

    function onSuccessfulSubmitCalendar(topic, data){
        console.log('submit successful');
        // window.location='/' //changeurl
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
