var recruiterID = localStorage.id;
var bookedSlotsWrapper = $(".booked-slots-wrapper.prototype");

$(document).ready(function(){
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/booked-slots", {}, populateSlots);

	$('#calendar').fullCalendar({
	    header: {
			left: 'title',
	        center: '',
	        right: 'prev,next today,month'
	    },
      	height: $(window).height()*0.83,
      	selectable: {
          	month: false,
          	agendaDay: true,
          	timelineDay: true
      	},
      	selectHelper: true,
      	editable: true,
   		showNonCurrentDates: false,
    	viewRender: function(view,element) {
            if(view.name=="month") {
                $('.fc-next-button,.fc-month-button,.fc-prev-button').show();
            }
		}
 	});

	//;
});

var date = "";

$(".booked-slots-container").on('click', ".booked-slots-card-header" , function() {
	var userId = $(this).attr("data-user-id");
	var jobId = $(this).attr("data-job-id");
	window.location = "/profile/"+userId+"?jobID="+jobId;
})

$(".booked-slots-container").on('click', ".booked-slots-heading" , function() {
	var date = $(this).text();
	$("#calendar").fullCalendar('gotoDate',date);
	$('.fc-day').removeClass("fc-state-highlight-specific");
	$('.fc-day[data-date= "'+date+'"]').addClass("fc-state-highlight-specific");
})

var populateSlots = function(res) {
    if(res["status"] == "success") {
		$(".animated-background-wrapper").addClass("hidden");
        var data = res["data"];
        data.sort(compare);
		console.log(data);
        data.forEach(function(aSlot){

            var slotCard = bookedSlotsWrapper.clone().removeClass('prototype hidden');
			var slotDate = ISODateToD_M_Y(aSlot["slotDate"]);
			$("body").bind("DOMNodeInserted", function() {
   				$(this).find('.fc-day[data-date= "'+slotDate+'"]').addClass("fc-state-highlight");
			});
			if(slotDate != date) {
				date = slotDate;
				slotCard.find(".booked-slots-heading").text(slotDate);
			}
			else {
				slotCard.find(".booked-slots-heading").addClass("hidden");
			}
			slotCard.find(".booked-slots-card-header").text(aSlot["name"]);
			slotCard.find(".booked-slots-card-header").attr("data-user-id", aSlot["userID"]);
			slotCard.find(".booked-slots-card-header").attr("data-job-id", aSlot["jobID"]);
			$(".booked-slots-container").append(slotCard);
        })
    }
}

function compare(a,b) {
  if (a.slotDate < b.slotDate)
    return 1;
  if (a.slotDate > b.slotDate)
    return -1;
  return 0;
}

function ISODateToD_M_Y(aDate) {
  var date = new Date(aDate),
	year = date.getFullYear(),
	month = date.getMonth(),
	dt = date.getDate();

  if (dt < 10) {
	dt = '0' + dt;
  }
  if (month < 10) {
	month = '0' + month;
  }

  var str = year + "-" + month + "-" + dt;
  return str;
}

function dateChange(aDate) {
	 var date = new Date(aDate);
	 return date.toDateString();

}
