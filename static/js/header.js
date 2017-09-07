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
    if(res.status =="success") {
		//console.log(res);
        userProfile.find('.email').text(res["data"][0]["email"])
    }
}
