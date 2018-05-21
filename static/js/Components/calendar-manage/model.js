function Manage() {
    var settings = {};
    function init() {
        settings.rowContainer=$('.schedule-container'),
        settings.rowDate='.calendar-date',
        settings.rowName='.calendar-wrap',
        settings.rowSlots='.total-slots',
        settings.noData='.no-data',
        settings.calendarRowPrototype = $('.calendarRow.prototype'),
        settings.emptyviewPrototype = $('.empty-view.prototype');
        settings.nocalendarview=$('.no-calendar-view')
        settings.editSchedule='.edit-schedule';
        settings.wrapperConatiner=$('.wrapper-container')
        jQuery(".header .menu-list-item.my-interviews").addClass("active");

        $(".createCalendar").click(function(){
            var eventObj = {
              event_category: eventMap["calendarSetup"]["cat"],
              event_label: 'origin=CalendarEmptyState,recId='+recruiterId+''
            }
            sendEvent(eventMap["calendarSetup"]["event"], eventObj)
            return true
        })

        $(".createCalendarNew").click(function(){
            var eventObj = {
              event_category: eventMap["calendarSetup"]["cat"],
              event_label: 'origin=ManageCalendar,recId='+recruiterId+''
            }
            sendEvent(eventMap["calendarSetup"]["event"], eventObj)
            return true
        })
    }

    function cloneRow(data){
        console.log(data)
        if(data.length==0){
            settings.wrapperConatiner.removeClass('hidden');
            $('.container').addClass('hidden');
            $('.page-content').css({"background-color":'#fff','padding':'0%'});
            return
        }
        var data = sortArrayOfObjectsByKeyDescending(data, "timestamp");
        data.forEach(function(aRow){
            var calendarRow =  settings.calendarRowPrototype.clone().removeClass('prototype hidden');
            calendarRow.find(settings.rowDate).text(moment(aRow.timestamp).format('MMM DD,YYYY'));
            calendarRow.find(settings.rowName).text(aRow.name).attr("href","/calendar/"+aRow["id"]+"/edit");
            var left = (aRow['left'] >100) ? "100+" : aRow['left'];
            calendarRow.find(settings.rowSlots).text(left);
            calendarRow.find(settings.editSchedule).attr("href","/calendar/"+aRow["id"]+"/edit");
            settings.rowContainer.append(calendarRow);
        });
    }

    return{
        init :init,
        cloneRow:cloneRow,
    }

}
