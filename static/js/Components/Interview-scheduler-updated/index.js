
var test = null;
$(document).ready(function(){
    var calendarDetails = Calendar();
    calendarDetails.init();
    calendarDetails.startdate();
    calendarDetails.enddate();
    calendarDetails.time_mapper();
    test= calendarDetails.testHighlight;
    calendarDetails.submitHandler(function(){
        if(calendarDetails.validate()){
        var data=calendarDetails.getDetails();
        submitCalendar(data,recruiterId);
        }
    })

    
    var calendarSubmitSuccessSubscription = pubsub.subscribe('submittedCalendar', onSuccessfulSubmitCalendar);
    var calendarSubmitFailSubscription = pubsub.subscribe('failedCalendarSubmission',onFailedSubmitCalendar);
    var fetchCalendarSuccessSubscription = pubsub.subscribe("fetchedJob:"+calendarId, onSuccessfulFetchCalendar);
	var fetchCalendarFailSubscription = pubsub.subscribe("failedToFetchJob:"+calendarId, onFailedFetchCalendar);

    function onSuccessfulFetchCalendar(topic,data){
        calendarDetails.setDetails(calendarId,data);
    }

    function onFailedFetchCalendar(topic,data){
        alert(res.status);
    }

    function onSuccessfulSubmitCalendar(topic, data){
        console.log('Login successful');
        window.location='/' //changeurl
    }

	function onFailedSubmitCalendar(topic, data){
		console.log('Login failed');
		calendarDetails.errorHandler(data);
    }
    
})    
