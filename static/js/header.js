var recruiterID = localStorage.id;
var userProfile = $(".user_profile_side");
var navBar = $(".navbar");

$(document).ready(function(){
	getRequest(baseUrl+"/recruiter/"+recruiterID, {}, populateHeader);
	userProfile.find(".dropdown").hover(showMenu);
	navBar.find(".menu-calendar").hover(showMenuCalendar);
	navBar.find(".menu-more").hover(showMenuMore);
	navBar.find(".manage-bookings").click(showAllCalendars);
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
        userProfile.find('.email').append(res["data"][0]["email"]+"<i class='email-caret fa fa-caret-down' aria-hidden='true'></i>").removeClass("animated-background");
		userProfile.find('.image-container img').attr('src', res["data"][0]["img_link"]).removeClass("animated-background");
    }
}
