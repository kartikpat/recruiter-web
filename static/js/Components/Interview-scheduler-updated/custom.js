$(document).ready(function() {


  $('#calendar').fullCalendar({
    header: {
      right: 'title,prev,next',
     // dateFormat : "D/M/Y",
      left:'Preview of slots created'
   },
    navLinks: false, // can click day/week names to navigate views
    businessHours: false, // display business hours 
    defaultView: 'basicWeek',
    columnFormat :'ddd \n D/M/Y'
  
  });
  
  Timer();
  Timeslots();
});

function Timeslots(){
    //debugger
    for(i=1;i<=24;i++){
                  
        if(i<12){
            $('.fc-day').append('<div id="hours-'+i+'" class="TimeLines">'+i+':00 AM </div>');
            $('.TimeLines').css({'padding-bottom' : '10px', 'text-align' : 'center'});
        }
        else if(i==12){
            $('.fc-day').append('<div id="hours-'+i+'" class="TimeLines">'+i+':00 PM </div>');
            $('.TimeLines').css({'padding-bottom' : '10px', 'text-align' : 'center'});
        }
        else if(i==24){
            $('.fc-day').append('<div id="hours-'+i+'" class="TimeLines">'+(i-12)+':00 AM </div>');
            $('.TimeLines').css({'padding-bottom' : '10px', 'text-align' : 'center'});
        }
        else{
            $('.fc-day').append('<div id="hours-'+i+'" class="TimeLines">'+(i-12)+':00 PM </div>');
            $('.TimeLines').css({'padding-bottom' : '10px', 'text-align' : 'center'});
        }
    }
} 


function Timer(){
  $(".fc-button").click(function(){
          
    for(i=1;i<=24;i++){
          
          if(i<12){
              $('.fc-day').append('<div id="hours-'+i+'" class="TimeLines">'+i+':00 AM </div>');
              $('.TimeLines').css({'padding-bottom' : '10px', 'text-align' : 'center'});
          }
          else if(i==12){
              $('.fc-day').append('<div id="hours-'+i+'" class="TimeLines">'+i+':00 PM </div>');
              $('.TimeLines').css({'padding-bottom' : '10px', 'text-align' : 'center'});
          }
          else if(i==24){
              $('.fc-day').append('<div id="hours-'+i+'" class="TimeLines">'+(i-12)+':00 AM </div>');
              $('.TimeLines').css({'padding-bottom' : '10px', 'text-align' : 'center'});
          }
          else{
              $('.fc-day').append('<div id="hours-'+i+'" class="TimeLines">'+(i-12)+':00 PM </div>');
              $('.TimeLines').css({'padding-bottom' : '10px', 'text-align' : 'center'});
          }
      }
  }) 

}