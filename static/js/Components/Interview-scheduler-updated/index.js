
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
    var calendarSubmitFailSubscription = pubsub.subscribe('failedCalendarSubmission', );
    
    function onSuccessfulSubmitCalendar(topic, data){onFailedSubmitCalendar
        console.log('Login successful');
        window.location='/' //pchangeurl
    }

	function onFailedSubmitCalendar(topic, data){
		console.log('Login failed');
		calendarDetails.errorHandler(data);
    }
    
})    
