var recruiterID = localStorage.id;
var baseUrl = "http://13.126.92.102:8000"
var headingRow = $(".calendar-events-header");
var contentRow = $(".calendar-row.prototype");

$(document).ready(function(){
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/calendar", {}, populateCalendarEvents);
	$(".button.create-new-calendar").click(createNewCalendar);
})

var createNewCalendar = function() {
	window.location = "/recruiter/"+recruiterID+"/slots?createNew=1"
}

var populateCalendarEvents= function(res) {
    if(res["status"] == "success") {
        var data = res["data"];
        if(data.length > 0) {
            headingRow.removeClass("hidden");
        }
        $.each(data, function(index, anObj) {
            var leftSlots;
            var row = contentRow.clone().removeClass('prototype hidden');
            row.find(".created-date").append(ISODateToD_M_Y(anObj["timestamp"]));
            row.find(".calendar-name").append('<a class="link-color" href="/recruiter/'+recruiterID+'/slots/'+anObj["id"]+'?createNew=0">' +anObj["name"]+'</a>');
            if(anObj["left"] > 100) {
                 leftSlots = "100+";
            }
            else {
                 leftSlots = anObj["left"];
            }
            row.find(".remaining-slots").append(leftSlots);
            $(".calendar-events-content").append(row);
        })
    }
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
  var str = dt + "-" + month + "-" + year;
  return str;
}
