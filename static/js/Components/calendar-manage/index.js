jQuery(document).ready( function(){
    var calendarManage = Manage();
    calendarManage.init();
    fetchRecruiterCalendar(recruiterId);
    var fetchJobSuccessSubscription=pubsub.subscribe('fetchedCalendars', onFetchSuccess)
	var fetchJobFailSubscription=pubsub.subscribe('failedToFetchCalendars', onFetchFail)
	function onFetchSuccess(topic,data){
        calendarManage.cloneRow(data.data);
    }
    function onFetchFail(){
        alert(res.status);
    }
});  
