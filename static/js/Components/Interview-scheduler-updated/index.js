var test = null;
$(document).ready(function(){
    var calendarDetails = Calendar();
    calendarDetails.init();
    calendarDetails.selectCreater();
    calendarDetails.copytoall();
    calendarDetails.fullCalendar();
    calendarDetails.startdate();
    calendarDetails.enddate();
    test= calendarDetails.testHighlight;
})    
