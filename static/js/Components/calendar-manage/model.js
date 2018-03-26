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
        settings.editSchedule='.edit-schedule';
        jQuery(".header .menu-list-item.my-interviews").addClass("active");
    }   


    function cloneRow(data){
        console.log(data);
        if(data.length==0){
            settings.emptyviewPrototype.removeClass('prototype hidden');
            settings.rowContainer.append(settings.emptyviewPrototype);
            return
        } 
        data.forEach(function(aRow){
            console.log(aRow["id"]);
            var calendarRow =  settings.calendarRowPrototype.clone().removeClass('prototype hidden');
            calendarRow.find(settings.rowDate).text(moment(aRow.timestamp).format('MMM DD,YYYY'));
            calendarRow.find(settings.rowName).text(aRow.name).attr("href","/calendar/"+aRow["id"]+"/edit");
            calendarRow.find(settings.rowSlots).text(aRow.nonBooked);
            calendarRow.find(settings.editSchedule).attr("href","/calendar/"+aRow["id"]+"/edit");
            settings.rowContainer.append(calendarRow);
        });
    }  
    
    return{
        init :init,
        cloneRow:cloneRow,
    }

}

