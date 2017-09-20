var profileContainer = $(".profile_container");
var tabContainer = $(".tab_container");
var resumeContainer = $(".resume-container");
var jobId;
var jobTitle;

//var recruiterID = 45058;
$(document).ready(function(){
	var recruiterID = localStorage.id ;
	jobId = getUrlParameter("jobID");
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+334895, {
		userID: userID
	}, storeProfile)
	$('#slider-down').click(function() {
		$(this).addClass("hidden");
		$("#slider-up").removeClass("hidden");
	  	$('.more_info').slideToggle();
	});
	$('#slider-up').click(function() {
		$(this).addClass("hidden");
		$("#slider-down").removeClass("hidden");
	  	$('.more_info').slideToggle();
	});

	profileContainer.find(".buttons .icon-status").click(performAction);

	jobTitle = getUrlParameter('jobTitle');
	if(jobTitle && jobId) {
		$(".job-title").text("Job : "+jobId+" , "+jobTitle+"");
	}
})

var performAction = function(event) {
	event.preventDefault();
	var hasClass = $(this).hasClass("highlighted");
	if(!(hasClass)) {
		var applicationId = profileContainer.attr("data-application-id");
		var dataAttribute = $(this).attr("data-attribute");
		postRequest(baseUrl+"/recruiter/"+recruiterID+"/action/"+jobId, null ,{
			action: dataAttribute,
			id: applicationId
		}, function(res) {
			if(res["status"] == "success") {
				profileContainer.find(".icon").removeClass("highlighted")
				profileContainer.find(".icon[data-attribute="+ dataAttribute +"]").addClass("highlighted");
			}
		}, hideDotLoader, showDotLoader)
	}
}

var showDotLoader = function() {
	$(".dot-loader-container").removeClass("hidden");
	profileContainer.find(".buttons").addClass("extra-height");
}

var hideDotLoader = function() {
	$(".dot-loader-container").addClass("hidden");
	profileContainer.find(".buttons").removeClass("extra-height");
}

var storeProfile = function(res){
	console.log(res)
	if(res.status=="success"){
		if(res["data"]["data"].length>0){
			var data = res["data"]["data"][0];
			profileContainer.attr("data-application-id", data["id"]);
			profileContainer.find(".userDetail .name").text(data["name"]);
			if(data["email"]) {
				profileContainer.find(".userDetail .email").html(data["email"]+"<span class='important-info-color'> (Verified)</span>");
			}
			else {
				profileContainer.find(".userDetail .email").addClass("hidden");
			}
			if(data["phone"]) {
				profileContainer.find(".userDetail .contact").html(data["phone"]+"<span class='important-info-color'> (Verified)</span>");
			}
			else {
				profileContainer.find(".userDetail .contact").addClass("hidden");
			}
			profileContainer.find(".userDetail .name").text(data["name"]);
			profileContainer.find(".extraInfo .experience").text("Experience: "+data["exp_y"]+"y "+data["exp_m"]+"m");
			profileContainer.find(".extraInfo .location").text("Location: "+data["current_location"]);
			profileContainer.find(".userDetail .notice").text("Notice: "+data["notice"]+ " months");
			profileContainer.find(".user_img").attr("src", data["imgUrl"]);
			profileContainer.find(".userDetail .sex").text(data["sex"]);
			profileContainer.find(".userDetail .age").text(getAge(data["dob"]));
			profileContainer.find(".userDetail .last-login").text("Last Login: "+ISODateToD_M_Y(data["last_active_date"]));
			profileContainer.find(".userDetail .applyDate").text("Applied: "+ISODateToD_M_Y(data["apply_date"]));
			//profileContainer.find(".userDetail .applyDate").text(data["apply_date"]);
			if(data["pref_location"]) {
				profileContainer.find(".extraInfo .prefLocation").text("Preferred Location: "+data["pref_location"]);
			}
			else {
				profileContainer.find(".extraInfo .prefLocation").addClass("hidden");
			}

			var curSalary = (data["current_ctc"])? data["current_ctc"]+" Lakhs": "confidential";
			profileContainer.find(".extraInfo .currentCTC").text("Current Salary: "+ curSalary);
			var expSalary = (data["expected_ctc"])? data["expected_ctc"]+" Lakhs": "confidential";
			profileContainer.find(".extraInfo .expectedCTC").text("Expected Salary: "+ expSalary);

			profileContainer.find(".moreInfo .maritalStatus").text(boolean(data["marital_status"]));
			if(data["language_known"]!= "") {
				profileContainer.find(".moreInfo .languages").text(formatLanguages(data["language_known"]));
			}
			else {
				profileContainer.find(".moreInfo .languages").text("nil");
			}
			profileContainer.find(".moreInfo .permit").text(boolean(data["work_permit"]));
			profileContainer.find(".moreInfo .handleTeam").text(boolean(data["handle_team"]));
			//profileContainer.find(".moreInfo .sixDayWorking").text(data[""]);
			profileContainer.find(".moreInfo .relocate").text(boolean(data["relocate"]));
			profileContainer.find(".moreInfo .differentlyAbled").text(boolean(data["differently_abled"]));
			profileContainer.find(".moreInfo .earlyStartup").text(boolean(data["early_startup"]));
			profileContainer.find(".moreInfo .travel").text(boolean(data["willing_travel"]));
			if(data["about"]!= "") {
				profileContainer.find(".moreInfo .about").text(boolean(data["about"]));
			}
			else {
				profileContainer.find(".moreInfo .about").addClass("hidden");
			}

			var status = data["status"];
 			profileContainer.find(".icon[data-attribute="+ status +"]").addClass("highlighted");
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

			resumeContainer.find(".resume-embed-container").html('<embed src="'+data["resumeUrl"]+'" class="resume-embed" type="application/pdf">')
			if(data["cover_text"]) {
				var coverText = data["cover_text"];
				resumeContainer.find(".cover_content").text(coverText);
			}
			else{
				resumeContainer.find(".cover_letter	").addClass("hidden");
				resumeContainer.find(".resume").css("width","100%");
			}
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
	month = month + 1
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

var getUrlParameter = function(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
