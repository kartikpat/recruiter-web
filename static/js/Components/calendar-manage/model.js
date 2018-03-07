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
    }   

    function cloneRow(data){
        if(data.length==0){
            settings.emptyviewPrototype.removeClass('prototype hidden');
            settings.rowContainer.append(settings.emptyviewPrototype);
            return
        } 
        data.forEach(function(aRow){
            var calendarRow =  settings.calendarRowPrototype.clone().removeClass('prototype hidden');
            calendarRow.find(settings.rowDate).text(moment(aRow.timestamp).format('MMM DD,YYYY'));
            calendarRow.find(settings.rowName).text(aRow.name);
            calendarRow.find(settings.rowSlots).text(aRow.nonBooked);
            settings.rowContainer.append(calendarRow);
        });
    }  
    
    return{
        init :init,
        cloneRow:cloneRow,
    }

}

