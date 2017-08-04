var profileContainer = $(".profile_container");
var tabContainer = $(".tab_container");
var resumeContainer = $(".resume-container");
var baseUrl = "http://13.126.92.102:8000"
var recruiterID = 45058;
$(document).ready(function(){
	var recruiterID = localStorage.id ;
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+334895, {
		userID: userID
	}, storeProfile)
	$('#slider').click(function() {
	  $('.more_info').slideToggle();

	});


})
var storeProfile = function(res){
	console.log(res)
	if(res.status=="success"){
		if(res["data"]["data"].length>0){
			var data = res["data"]["data"][0];
			profileContainer.find(".userDetail .name").text(data["name"]);
			profileContainer.find(".userDetail .experience").text("Experience: "+data["exp_y"]+"y "+data["exp_m"]+"m");
			profileContainer.find(".userDetail .location").text(data["current_location"]);
			profileContainer.find(".userDetail .notice").text(data["notice"]+ " months");
			profileContainer.find(".user_img").text(data["imgUrl"]);
			profileContainer.find(".userDetail .sex").text(data["sex"]);
			profileContainer.find(".userDetail .age").text(getAge(data["dob"]));
			profileContainer.find(".userDetail .applyDate").text("Applied: "+ISODateToD_M_Y(data["apply_date"]));
			//profileContainer.find(".userDetail .applyDate").text(data["apply_date"]);

			profileContainer.find(".extraInfo .prefLocation").text(data["pref_location"]);
			var curSalary = (data["current_ctc"])? data["current_ctc"]+" Lakhs": "confidential";
			profileContainer.find(".extraInfo .currentCTC").text("Current Salary: "+ curSalary);
			var expSalary = (data["expected_ctc"])? data["expected_ctc"]+" Lakhs": "confidential";
			profileContainer.find(".extraInfo .expectedCTC").text("Expected Salary: "+ expSalary);

			profileContainer.find(".moreInfo .maritalStatus").text(boolean(data["marital_status"]));
			profileContainer.find(".moreInfo .languages").text(formatLanguages(data["language_known"]));
			profileContainer.find(".moreInfo .permit").text(boolean(data["work_permit"]));
			profileContainer.find(".moreInfo .handleTeam").text(boolean(data["handle_team"]));
			profileContainer.find(".moreInfo .sixDayWorking").text(data[""]);
			profileContainer.find(".moreInfo .relocate").text(boolean(data["relocate"]));
			profileContainer.find(".moreInfo .differentlyAbled").text(boolean(data["differently_abled"]));
			profileContainer.find(".moreInfo .earlyStartup").text(boolean(data["early_startup"]));
			profileContainer.find(".moreInfo .travel").text(boolean(data["willing_travel"]));
			profileContainer.find(".moreInfo .about").text(boolean(data["about"]));
			var status = data["status"];
 			profileContainer.find(".icon[data-attribute="+ status +"]").addClass("highlight");
			data["jobs"].forEach(function(aJob, index){
				if(index>2){
					return
				}
				var card = $(".jobCard.prototype").clone().removeClass('prototype hidden');
				card.find(".name").text(aJob["organization"])
				card.find(".designation").text(aJob["designation"]);
				card.find(".exp").text(aJob["from_exp_month"]+"/"+aJob["from_exp_year"]+" - "+aJob["to_exp_month"]+"/"+aJob["to_exp_year"]);
				profileContainer.find(".profile_content .organization").append(card);
			})
			data["edu"].forEach(function(anEdu,index){
				if(index>2){
					return
				}
				var column = $(".instituteCard.prototype").clone().removeClass('prototype hidden');

				column.find(".name").text(anEdu["institute"]);
				column.find(".start_duration").text(anEdu["batch_from"]);
				column.find(".end_duration").text(anEdu["batch_to"]);
				column.find(".degree").text(anEdu["degree"]);
				profileContainer.find('.profile_content .institute').append(column);
			})
 			tabContainer.find(".email").text(data["email"]);
			if(data["phone"]) {
				tabContainer.find(".contact").text(data["phone"]);
			}
			else {
				tabContainer.find(".info.phone").addClass("hidden");
			}
			//resumeContainer.find(".resume-embed").atrr("src",data["resumeUrl"]);
		/*	if(data.hasOwnProperty("cover_text")) {
				console.log(data);
				var coverText = data["cover_text"];
				if(cover_text) {
					resumeContainer.find(".cover_content").text(coverText);
				}
				else {
					resumeContainer.find(".cover_letter .content").addClass("hidden");
				}
			} */
		}
	}
}

function boolean(data) {
	if(data === 1) {
		return "yes"
	}
	else if (data === 0) {
		return "no"
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

function getAge(dateString) {
	var today = new Date();
	var birthDate = new Date(dateString);
	var age = today.getFullYear() - birthDate.getFullYear();
	var m = today.getMonth() - birthDate.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}

	 return age;
}

function formatLanguages(data){
	var ob = JSON.parse(data);
	var langArray = [];
	for(var key in ob){
		langArray.push(ob[key]["language_text"]);
	}
	return langArray.join(", ");
}
