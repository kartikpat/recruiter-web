
var test = null;
$(document).ready(function(){
    var calendarDetails = Calendar();
    calendarDetails.init();
    calendarDetails.startdate();
    calendarDetails.enddate();
    test= calendarDetails.testHighlight;

    calendarDetails.submitHandler(function(){
        if(calendarDetails.validate()){
        var data=calendarDetails.getDetails();
        submitCalendar(data,recruiterId);
        }
    })

    var calendarSubmitSuccessSubscription = pubsub.subscribe('submittedCalendar', onSuccessfulSubmitCalendar);
	var calendarSubmitFailSubscription = pubsub.subscribe('failedCalendarSubmission', onFailedSubmitCalendar);

    function onSuccessfulSubmitCalendar(){
        console.log("success");
    }
    function onFailedSubmitCalendar(){
        console.log("fail");
    }
})    
