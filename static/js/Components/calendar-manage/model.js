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

        jQuery(".header .menu-list-item.my-interviews").addClass("active");
    }

    function cloneRow(data){
        if(data.length==0) {
            settings.nocalendarview.removeClass('hidden');
            return
        }

        $('.page-content').removeClass('hidden');

        var data = sortArrayOfObjectsByKeyDescending(data, "timestamp")
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
