var baseUrl = "http://localhost:8000";
var recruiterID = 43122;
var profile = $(".profile");
var tableRow = $(".jobs_content.prototype");
$(document).ready(function(){
	getRequest(baseUrl+"/recruiter/"+recruiterID, {}, populateProfile);
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs", {}, populateJobs);
})

var populateProfile = function(res){
	if(res.status =="success"){
		var data = res["data"][0];
		profile.find(".user_image img").attr('src', data["img_link"]);
		profile.find(".user_name").text(data["name"]);
		profile.find(".user_designation").text(data["desg"]);
		profile.find(".extra_info .viewed").text("Viewed: "+ data["hits"]+" times");
		profile.find(".extra_info .last_login").text("Last login: "+ new Date(data["d_login"]).toLocaleString());
		profile.find(".profile_link").text(data["rurl"])
	}
}

var populateJobs = function(res){
	if(res.status=="success"){
		res["data"].forEach(function(aJob){
			var card = tableRow.clone().removeClass('prototype hidden');
			card.find(".date").text()
		})
	}
}
function (aDate){
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