$(document).ready(function() {
    // page is now ready, initialize the calendar...

    $('#calendar').fullCalendar({

      header: {

           left: 'title',
           center: '',
           right : 'prev,next today,month,changeViewFromDayToMonth'

         },

      height: $(window).height()*0.83,

      selectable: {
          month: false,
          agendaDay: true
      },

      selectHelper: true,

      editable: true,

      dayClick: function(date, jsEvent, view) {

          if(view.name === "month") {

             $('#calendar').fullCalendar('changeView', 'agendaDay');
             $('#calendar').fullCalendar('gotoDate', date);
             $('#calendar').css('width', '50%');

         }
      },

      select: function(start,end,jsEvent,view) {

          if(view.name === "agendaDay") {
            $('#createEventModal #apptStartTime').val(start);
            $('#createEventModal #apptEndTime').val(end);
                  $('#createEventModal').modal('show');
                }
              },

      //Activating modal for 'when an event is clicked'
      eventClick: function (event) {
          $('#modalTitle').html(event.title);
          $('#modalBody').html(event.description);
          $('#fullCalModal').modal();
      },

      customButtons: {
        changeViewFromDayToMonth : {
            text: 'Back',
            click: function(jsEvent) {
              $('#calendar').fullCalendar('changeView', 'month');
              $('#calendar').css('width', '100%');
            }
        }
    },

    businessHours: {
    // days of week. an array of zero-based day of week integers (0=Sunday)
        dow: [ 0, 1, 2, 3, 4, 5, 6], // Monday - Thursday

        start: '09:00', // a start time (10am in this example)
        end: '21:00', // an end time (6pm in this example)
   },

   showNonCurrentDates: false,

   eventLimit: true, // for all non-agenda views
    views: {
        agenda: {
            eventLimit: 6 // adjust to 6 only for agendaWeek/agendaDay
        }
    },

    viewRender: function(view,element) {
                if(view.name=="month"){
                    //month
                    $('.fc-changeViewFromDayToMonth-button').hide();
                    $('.fc-next-button,.fc-month-button,.fc-prev-button').show();
                }else if(view.name == "agendaDay"){
                    $('.fc-changeViewFromDayToMonth-button').show();
                    $('.fc-next-button,.fc-month-button,.fc-prev-button').hide();
                }
}

 });
                          function doSubmit(){
                          $("#createEventModal").modal('hide');
                          $("#calendar").fullCalendar('renderEvent',
                              {
                                  title: $('#eventName').val(),
                                  start: new Date($('#apptStartTime').val()),
                                  end: new Date($('#apptEndTime').val()),
                              },
                              true);
                          }


                              $('#submitButton').on('click', function(e){
                                  // We don't want this to act as a link so cancel the link action
                                  e.preventDefault();

                                  doSubmit();
                                });



});
