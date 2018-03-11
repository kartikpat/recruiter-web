// $(document).ready(function() {
//   $('#calendar').fullCalendar({
//     header: {
//       right: 'title,prev,next',
//      // dateFormat : "D/M/Y",
//       left:'Preview of slots created'
//    },
//     navLinks: false, // can click day/week names to navigate views
//     businessHours: false, // display business hours 
//     defaultView: 'basicWeek',
//     columnFormat :'ddd \n D/M/Y'
  
//   });
//   $(".fc-button").on("click", Timer);
//   Timer();
 
// });

// function Timer(e){       
//     for(i=1;i<=24;i++){   
//         if(i<12){
//               $('.fc-day').append('<div id="hours-'+i+'" class="TimeLines">'+i+':00 AM </div>');
//         }
//         else if(i==12){
//               $('.fc-day').append('<div id="hours-'+i+'" class="TimeLines">'+i+':00 PM </div>');
//         }
//         else if(i==24){
//               $('.fc-day').append('<div id="hours-'+i+'" class="TimeLines">'+(i-12)+':00 AM </div>');
//         }
//         else{
//               $('.fc-day').append('<div id="hours-'+i+'" class="TimeLines">'+(i-12)+':00 PM </div>');
//           }
//       }
// }