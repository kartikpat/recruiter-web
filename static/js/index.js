var recruiterID = localStorage.id;
var profile = $(".user_profile");
var tableRow = $(".jobs_content.prototype");


var modal = $('.modal');
var openGuidelines = $("#posting-guidelines");
var closeModalBtn = $(".close");



$(document).ready(function(){
	getRequest(baseUrl+"/recruiter/"+recruiterID, {}, populateProfile);
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs", {}, populateJobs);

	openGuidelines.click(openModal);
	closeModalBtn.click(closeModal);
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.addClass('hidden');
        }
    }
})

var openModal = function() {
    modal.removeClass('hidden');
}

var closeModal = function() {
    modal.addClass('hidden');
}

var populateProfile = function(res){
	if(res.status =="success"){
		var data = res["data"][0];
		profile.find(".edit_profile img").attr('src', data["img_link"]);
		profile.find(".user_name").text(data["name"]);
		profile.find(".user_designation").text(data["desg"]);
		profile.find(".extra_info .viewed").text(data["hits"]);
		profile.find(".extra_info .last_login").text( new Date(data["d_login"]).toLocaleString());
		profile.find(".profile_link").text(data["rurl"]);
		
	}
}

var populateJobs = function(res){
	if(res.status=="success"){
		res["data"].forEach(function(aJob){
			var card = tableRow.clone().removeClass('prototype hidden');
			var status = "" ;

			card.find(".date").text(date_ddmmyy(aJob["created"]));
			card.find(".title").text(aJob["title"]);
			card.find(".status").text(aJob["rej"]);
			card.find(".views").html(( aJob["views"])? aJob["views"]+" views ("+( (aJob["applied"])? '<a href="/job/'+aJob["id"]+'/candidates?title='+aJob["title"]+'">'+aJob["applied"]+'</a>'+  ")": "0)" ): "" )
			$('.jobs_container').append(card);
		})
	}
}

function date_ddmmyy (aDate){
	var today = new Date(aDate);
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!

	var yyyy = today.getFullYear();
	if(dd<10){
		dd='0'+dd;
	}
	if(mm<10){
		mm='0'+mm;
	}
	var today = dd+'/'+mm+'/'+yyyy;
	return today;
}
