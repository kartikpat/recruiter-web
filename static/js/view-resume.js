var profileContainer = $(".profile_container");
var tabContainer = $(".tab_container");
var resumeContainer = $(".resume-container");
var jobId;
var jobTitle;
var recruiterID = localStorage.id ;
//var recruiterID = 45058;
$(document).ready(function() {

	jobId = getUrlParameter("jobID");
	console.log(userID);
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+jobId, {
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
				profileContainer.find(".userDetail .email").html(data["email"]+"<span class='important-info-color'> (Verified)</span>").removeClass("animated-background");
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
			profileContainer.find(".userDetail .name").text(data["name"]).removeClass("animated-background");
			profileContainer.find(".extraInfo .experience").text("Experience: "+data["exp_y"]+"y "+data["exp_m"]+"m");
			profileContainer.find(".extraInfo .location").text("Location: "+data["current_location"]);
			if(data["notice"] > 6) {
				profileContainer.find(".userDetail .notice").text("Notice: Immediately Available");
			}
			else {
				profileContainer.find(".userDetail .notice").text("Notice: "+data["notice"]+ " months");
			}
			profileContainer.find(".user_img").attr("src", data["imgUrl"]).removeClass("animated-background");
			profileContainer.find(".userDetail .sex").text(getTypeGender(data["sex"]));
			profileContainer.find(".userDetail .age").text(getAge(data["dob"]) + " years");
			profileContainer.find(".userDetail .last-login").text("Last Login: "+ISODateToD_M_Y(data["last_active_date"]));
			profileContainer.find(".userDetail .applyDate").text("Applied: "+ISODateToD_M_Y(data["apply_date"]));
			profileContainer.find(".shell-loader-container").addClass("hidden");
			//profileContainer.find(".userDetail .applyDate").text(data["apply_date"]);
			if(data["pref_location"]) {
				profileContainer.find(".extraInfo .prefLocation").text("Preferred Location: "+data["pref_location"]);
			}
			else {
				profileContainer.find(".extraInfo .prefLocation").text("Preferred Location: Not Specified");
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
			data["jobs"] = data["jobs"].sort(compare);
			data["jobs"].forEach(function(aJob, index){
				if(index>2){
					return
				}
				var card = $(".jobCard.prototype").clone().removeClass('prototype hidden');
				card.find(".name").text(aJob["organization"])
				card.find(".designation").text(aJob["designation"]);
				card.find(".extra_info").text(getOrgExp(aJob["from_exp_month"],aJob["from_exp_year"],aJob["to_exp_month"],aJob["to_exp_year"],aJob["is_current"]));
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
			data["tags"].forEach(function(anTag, index){

				var divEl = $('.tags-jobSeeker.prototype').clone().removeClass('prototype hidden');
				divEl.find(".tags-content").attr("data-tag-name",anTag["name"]);
				divEl.find(".tags-content").attr("data-id",anTag["id"]);
				divEl.find(".tags-content").attr("data-jobseeker-id",data['userID']);
				divEl.find(".tags-content").attr("data-jobapplication-id",data['id']);
				divEl.find(".tags-content").text(anTag["name"]);
				divEl.find(".tags-content").addClass(' margin-right font-sm');
				divEl.find(".js-remove-tag").attr("data-id",anTag["id"]);
				divEl.find(".js-remove-tag").attr("data-jobseeker-id",data['userID']);
				divEl.find(".js-remove-tag").attr("data-jobapplication-id",data['id']);

				profileContainer.find('.posted-tags').append(divEl);
			})
			tabContainer.find(".submit-comment").attr("data-job-seeker-id",data["userID"]);
			tabContainer.find(".submit-comment").attr("data-application-id",data["id"]);
			tabContainer.find(".submit-tag").attr("data-jobseeker-id",data["userID"]);
			tabContainer.find(".submit-tag").attr("data-jobapplication-id",data["id"]);
			if(data["comment"]) {
				tabContainer.find(".add-comment").val(data["comment"]);
				tabContainer.find(".submit-comment").text("Update");
			}
			else {
				tabContainer.find(".submit-comment").text("Comment");
			}
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

tabContainer.on('click',".comment-close-message", function(){
	$(this).parent().addClass("hidden");
});

tabContainer.on("click", '.submit-comment', function() {

	var obj = {};
	obj["comment"] = $(this).prev().val();
	obj["seekerID"] = $(this).attr("data-job-seeker-id");
	var applicationId = $(this).attr("data-application-id");
	var elem = $(this);
	postRequest(baseUrl+"/recruiter/"+recruiterID+"/job/"+jobId+"/application/"+applicationId+"/comment", null,
	 obj , function(res) {
		 if(res["status"] == "success") {
		 	tabContainer.find(".posted-comment").html("successfully posted<i class='comment-close-message fa fa-times' aria-hidden='true'></i>").removeClass("hidden");
		}
	});
});

tabContainer.find(".add-comment").keypress(function(event) {
	var key = event.which;
    if(key == 13) {
		var obj = {};
		obj["comment"] = $(this).val();
		obj["seekerID"] = $(this).next().attr("data-job-seeker-id");
		var applicationId = $(this).next().attr("data-application-id");
		var elem = $(this);
		postRequest(baseUrl+"/recruiter/"+recruiterID+"/job/"+jobId+"/application/"+applicationId+"/comment", null,
		 obj , function(res) {
			 if(res["status"] == "success") {
			 	tabContainer.find(".posted-comment").html("successfully posted<i class='comment-close-message fa fa-times' aria-hidden='true'></i>").removeClass("hidden");
			}
		});
	}
});

$(".tab_container .add-tag").keypress(function(event) {
    var key = event.which;
    if(key == 13) {
		var obj = {};
		obj["name"] = $(this).val();
		$(this).val('');
		var tagId = $(this).attr("tag-id");
		if(tagId != '') {
			obj["id"] = tagId;
		}
		obj["seekerID"] = $(this).next().attr("data-jobseeker-id");
		obj["applicationID"] = $(this).next().attr("data-jobapplication-id");
		console.log(obj);
		if(obj["name"] != '') {
			postRequest(baseUrl+"/recruiter/"+recruiterID+"/tag", null ,
			obj, function(res) {
					if(res["status"] == "success") {
						var divEl = $('.tags-jobSeeker.prototype').clone().removeClass('prototype hidden');
						divEl.find(".tags-content").attr("data-tag-name",obj["name"]);
						divEl.find(".tags-content").attr("data-id",tagId);
						divEl.find(".tags-content").attr("data-jobseeker-id",obj["seekerID"]);
						divEl.find(".tags-content").attr("data-jobapplication-id",obj["applicationID"]);
						divEl.find(".tags-content").text(obj["name"]);
						divEl.find(".tags-content").addClass(' margin-right font-sm');
						divEl.find(".js-remove-tag").attr("data-id",tagId);
						divEl.find(".js-remove-tag").attr("data-jobseeker-id",obj["seekerID"]);
						divEl.find(".js-remove-tag").attr("data-jobapplication-id",obj["applicationID"]);

						$('.posted-tags').append(divEl);
					}
			});
		}
	}
})

$(".tab_container").on("click", '.tab_content .submit-tag', function() {
	var obj = {};
	obj["name"] = $(this).prev().val();
	console.log(obj["name"]);
	$(this).prev().val('');
	var tagId = $(this).prev().attr("tag-id");
	if(tagId != '') {
		obj["id"] = tagId;
	}
	obj["seekerID"] = $(this).attr("data-jobseeker-id");
	obj["applicationID"] = $(this).attr("data-jobapplication-id");
	console.log(obj);
	if(obj["name"] != '') {
		postRequest(baseUrl+"/recruiter/"+recruiterID+"/tag", null ,
		obj, function(res) {
				if(res["status"] == "success") {
					var divEl = $('.tags-jobSeeker.prototype').clone().removeClass('prototype hidden');
					divEl.find(".tags-content").attr("data-tag-name",obj["name"]);
					divEl.find(".tags-content").attr("data-id",tagId);
					divEl.find(".tags-content").attr("data-jobseeker-id",obj["seekerID"]);
					divEl.find(".tags-content").attr("data-jobapplication-id",obj["applicationID"]);
					divEl.find(".tags-content").text(obj["name"]);
					divEl.find(".tags-content").addClass(' margin-right font-sm');
					divEl.find(".js-remove-tag").attr("data-id",tagId);
					divEl.find(".js-remove-tag").attr("data-jobseeker-id",obj["seekerID"]);
					divEl.find(".js-remove-tag").attr("data-jobapplication-id",obj["applicationID"]);

					$('.posted-tags').append(divEl);
				}
		});



	}

})

$(".profile_container").on("click", '.js-remove-tag.job-seeker-tags', function() {
	var tagId = $(this).attr("data-id");
	var obj = {}
	obj["seekerID"] = $(this).attr("data-jobseeker-id");
	obj["applicationID"] = $(this).attr("data-jobapplication-id");
	var elem = $(this);

	postRequest(baseUrl+"/recruiter/"+recruiterID+"/tag/"+tagId+"/delete", null ,
	obj, function(res) {

			if(res["status"] == "success") {
				console.log("hi");

				elem.parent().remove();

			}
	});

})

function getMonthName(month) {
	var monthNames = ["Jan", "Feb", "March", "April", "May", "June",
                        "July", "Aug", "Sep", "Oct", "Nov", "Dec"
                    ];
	return monthNames[month];
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

function getTypeGender(gender) {
	var gen;
	if(gender == -1) {
		gen = "";
	}
	else if (gender == 1) {
		gen = "Male";
	}
	else if (gender == 2) {
		gen = "Female";
	}
	else if (gender == 3) {
		gen = "Not Mentioned"
	}
	return gen;
}

function getOrgExp(fromExpMonth, fromExpYear,toExpMonth,toExpYear,isCurrent) {
  var str = '';
  // if (fromExpMonth < 10) {
  // fromExpMonth = '0' + fromExpMonth;
  // }
  fromExpMonth = getMonthName(fromExpMonth);
  // if (toExpMonth < 10) {
  // oExpMonth = '0' + toExpMonth;
  // }
  toExpMonth = getMonthName(toExpMonth);
	 if(isCurrent == 1)
		str = fromExpMonth + ", " + fromExpYear + " to Present";
	 else
		str = fromExpMonth + ", " + fromExpYear + " to " + toExpMonth + ", " + toExpYear;
  return str;
}

function compare(a,b) {
  if (a.from_exp_year <= b.from_exp_year){
	  if (a.from_exp_month < b.from_exp_month) {
		  return -1;
	  }
  }

  if (a.from_exp_year >= b.from_exp_year) {
	  if (a.from_exp_month > b.from_exp_month) {
		 return 1;
	 }
  }
  return 0;
}
