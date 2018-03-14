var test = null;
$(document).ready(function(){
    var calendarDetails = Calendar();
    calendarDetails.init();
    calendarDetails.startdate();
    calendarDetails.enddate();
    test= calendarDetails.testHighlight;
})    
