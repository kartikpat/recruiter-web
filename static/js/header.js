var userProfile = $(".user_profile_side");
var navBar = $(".navbar");
var maxCandidateChats;


$(document).ready(function(){

  jQuery(".exit-view").on("click", function() {
    jQuery(".header .navigation").removeClass("hidden");
    jQuery(".header .search-container").addClass("hidden");
  });

	if ($(document).width() < 1000) {
		maxCandidateChats = 1
	} else {
		if ($(document).width() < 1450) {

			maxCandidateChats = 2
		} else {

			maxCandidateChats = 3
		}
	}

	// getRequest(baseUrl+"/recruiter/"+recruiterID, {}, populateHeader);
	userProfile.find(".dropdown").hover(showMenu);
	navBar.find(".menu-calendar").hover(showMenuCalendar);
	navBar.find(".menu-more").hover(showMenuMore);
	navBar.find(".manage-bookings").click(showAllCalendars);

	$("#search-solar").keyup(function(event){
    if(event.keyCode == 13){
        var queryParameter = $(this).val();
		window.location = "/recruiter/filter-candidate?queryParameter="+queryParameter;
    }

});
	$(".saved-shortlisted").click(function(event) {
		event.preventDefault();
		window.location = "/recruiter/filter-candidate";
	})
})

var showAllCalendars = function(event) {
	event.preventDefault();
	window.location =  "/recruiter/" + recruiterID + "/calendar";
}

var showMenu = function() {
	userProfile.find(".options").toggleClass("hidden");
}

var showMenuCalendar = function() {
	navBar.find(".menu-calendar .options").toggleClass("hidden");
}

var showMenuMore = function() {
	navBar.find(".menu-more .options").toggleClass("hidden");
}

var populateHeader = function(res) {
	console.log(res);
    if(res.status =="success") {
		recruiterEmail = res["data"][0]["email"];
		recruiterImage = res["data"][0]["img_link"];
        userProfile.find('.email').append(recruiterEmail+"<i class='email-caret fa fa-caret-down' aria-hidden='true'></i>").removeClass("animated-background");
		userProfile.find('.image-container img').attr('src', recruiterImage).removeClass("animated-background");
    }
}

var displayAMessage = function(event) {
    var key = event.which;
    if(key == 13) {
        var message = $(this).val();
        sendMessage(message);
        $(this).val('');
    }
}

var sendMessage = function(message) {
    $(".candidate-chat-content").append("<div class='message-container right'><div class='message-sent'>"+message+"<span class='current-time'>"+startTime()+"</span></div></div>");
    var channel = chatMainContainer.attr('data-id');
    console.log(channel);

    publish({
        UUID: btoa(recruiterID+'--'+recruiterEmail),
        deviceID: getCookie("sessID"),
        time: Date.now(),
        usr: recruiterID,
        name: recruiterName,
        tt:1,
        msg: message,
        img: recruiterImage,
        type: 1
    }, channel, function(m){
        console.log("message sent");
    })
}

function ISODateToD_M(aDate) {
  var date = new Date(aDate),
	month = date.getMonth(),
	dt = date.getDate();

  if (dt < 10) {
	dt = '0' + dt;
  }
  if (month < 10) {
	month = '0' + month;
  }

  var str = dt + "/" + month;
  return str;

}

function ISODateToD_M_Y(aDate) {
    var monthNames = ["Jan", "Feb", "March", "April", "May", "June",
                        "July", "Aug", "Sep", "Oct", "Nov", "Dec"
                    ];
  var date = new Date(aDate),
	month = monthNames[date.getMonth()],
    year = date.getFullYear(),
	dt = date.getDate();

  if (dt < 10) {
	dt = '0' + dt;
  }
  if (month < 10) {
	month = '0' + month;
  }

  var str = dt + " " + month + " " + year;
  return str;
}

function ISODateToTime(aDate) {
  var date = new Date(aDate),
	hours = date.getHours(),
	mins = date.getMinutes();
    mins = checkTime(mins);
      var str = hours + ":" + mins;
      return str;
}

jQuery(".header").on("click",".mobile-menu", function() {
  jQuery("body").addClass("posf");
  jQuery(".body-overlay").removeClass("hidden").addClass("veiled");
  jQuery(".mobile-menu-container").removeClass("hidden");
});
var closeMobileMenu = function() {
   jQuery("body").removeClass("posf");
    jQuery(".body-overlay").removeClass("veiled").addClass("hidden");
    jQuery(".mobile-menu-container").addClass("hidden");
}
jQuery(".body-overlay").on('click',function() {
  if(jQuery(this).hasClass("veiled")) {
    closeMobileMenu();
  }
});

jQuery(".mobile-menu-container").on('click', ".close-mobile-menu", closeMobileMenu);
