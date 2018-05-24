$(document).ready(function(){
    var calendarDetails = Calendar();

    if(calendarId){
        var insuffSlotsErrMsg = getQueryParameter("insuffSlotsErrMsg");
        if(!isEmpty(insuffSlotsErrMsg)) {
            toastNotify(3, "There are no remaining slots for this calendar. Please add more slots.")
            var newUrl = removeParam("insuffSlotsErrMsg", window.location.href)
            window.history.replaceState("object or string", "Title", newUrl);
        }
        
        fetchCalendars(calendarId,recruiterId);
        $('.form-container').removeClass('hidden');
        $('.Availability').removeClass('hidden');
        $('.second-container ').removeClass('hidden');
        $('.bottom-container ').removeClass('hidden');
        $('.loaderScroller').addClass("hidden");

    }
    calendarDetails.init();

    // if(!calendarId){
    //     // calendarDetails.selectCreater();
    //     // calendarDetails.startdate();
    //     // calendarDetails.enddate();
    //     // calendarDetails.testHighlight();
    // }

    calendarDetails.submitHandler(function(action){
        if(action == "update") {
            var eventObj = {
              event_category: eventMap["calendarEdit"]["cat"],
              event_label: 'origin=ManageCalendar,source=CalendarForm,recId='+recruiterId+''
            }
            sendEvent(eventMap["calendarEdit"]["event"], eventObj)
        }
        else {
            var eventObj = {
              event_category: eventMap["createCalendar"]["cat"],
              event_label: 'origin=ManageCalendar,source=CalendarForm,recId='+recruiterId+''
            }
            sendEvent(eventMap["createCalendar"]["event"], eventObj)
        }

        if(calendarDetails.validate()){
        spinner();
        var data=calendarDetails.getDetails();
        submitCalendar(data,calendarId,recruiterId);
        }
    })

    function onSuccessfulFetchCalendar(topic,data){
        calendarDetails.setDetails(data);
    }

    function onFailedFetchCalendar(topic,data){
        alert(res.status);
    }

    function onSuccessfulSubmitCalendar(topic, data){
        console.log('submit successful');
        spinner();
        window.location=staticEndPoints.manageCalendar
    }

	function onFailedSubmitCalendar(topic, data){
        togglespinner();
		// calendarDetails.errorHandler(data);
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
