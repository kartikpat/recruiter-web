$(document).ready(function(){
    var calendarDetails = Calendar();    
     //  calendarDetails.init();
    calendarDetails.startdate();
    calendarDetails.enddate();
    // calendarDetails.time_mapper();
    // calendarDetails.testHighlight;
    console.log(calendarId);
    if(!calendarId){
        calendarDetails.init();
        calendarDetails.startdate();
        calendarDetails.enddate();
        calendarDetails.time_mapper();
        calendarDetails.testHighlight;
    }
 
    if(calendarId){
        fetchCalendars(calendarId,recruiterId);
        $('.form-container').removeClass('hidden');
        $('.Availability').removeClass('hidden');
        $('.second-container ').removeClass('hidden');
        $('.bottom-container ').removeClass('hidden');
        $('.loaderScroller').addClass("hidden");
       
    }

    calendarDetails.submitHandler(function(){
        console.log("click")
        if(calendarDetails.validate()){
        spinner();
        var data=calendarDetails.getDetails();
        submitCalendar(data,calendarId,recruiterId);
        }
    })

    function onSuccessfulFetchCalendar(topic,data){
        console.log(data);
        calendarDetails.init();
        calendarDetails.setDetails(data);
        calendarDetails.startdate();
        calendarDetails.enddate();
        calendarDetails.time_mapper();
        calendarDetails.testHighlight;
    }

    function onFailedFetchCalendar(topic,data){
        alert(res.status);
    }

    function onSuccessfulSubmitCalendar(topic, data){
        console.log('submit successful');
        spinner();
        window.location='/calendar-manage' //changeurl
    }

	function onFailedSubmitCalendar(topic, data){
        togglespinner();
		calendarDetails.errorHandler(data);
    }

    var calendarSubmitSuccessSubscription = pubsub.subscribe('submittedCalendar',onSuccessfulSubmitCalendar);
    var calendarSubmitFailSubscription = pubsub.subscribe('failedCalendarSubmission',onFailedSubmitCalendar);
  
    var fetchCalendarSuccessSubscription = pubsub.subscribe("fetchedCalendars",onSuccessfulFetchCalendar);
	var fetchCalendarFailSubscription = pubsub.subscribe("failedToFetchCalendars",onFailedFetchCalendar);
    
    function spinner(){
        $('#submit').addClass('hidden')
        $('.spinner').removeClass('hidden');
    }

    function togglespinner(){
        $('#submit').removeClass('hidden')
        $('.spinner').addClass('hidden');
    }
})    
