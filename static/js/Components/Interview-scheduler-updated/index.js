
$(document).ready(function(){
    var calendarDetails = Calendar();
    calendarDetails.init();
    calendarDetails.getDetails();
    calendarDetails.selectCreater();
    calendarDetails.copyTime();
    calendarDetails.copytoall();
    calendarDetails.getslots();
    calendarDetails.time_mapper();
    calendarDetails.finalslots();
})    