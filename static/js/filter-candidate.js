var tagId;
var mainContainer = $(".main-container");
var tableRow = $(".jobs_content.prototype");
var columnOrg =  $(".organization.prototype");
var columnIns =  $(".institute.prototype");

$(document).ready(function(){
	var queryParameter = getUrlParameter('queryParameter');
	tagId = getUrlParameter('tagID');
    var tagName = getUrlParameter('tagName');
	var status = getUrlParameter('status');

	if(tagId && tagName) {
    	getRequest(baseUrl+"/recruiter/"+recruiterID+"/tag/"+tagId+"/seekers" ,{ }, populateCandidates);
		$(".main-container .top-container").removeClass("hidden");
		$(".main-container .tag-heading-container").removeClass("hidden");
		$(".main-container .tag-heading-container .heading").text("Tag: "+tagName);
	}
	else if (queryParameter) {
		$('.jobs_wrapper').empty();
		getRequest(baseUrl+"/recruiter/33765/search?queryStr="+queryParameter ,{ }, populateSolarSearch);
		$(".main-container .top-container").removeClass("hidden");
		$(".main-container .solar-search-container").removeClass("hidden");
		$(".main-container .solar-search-container input").val(queryParameter);
	}
	else if (status) {
		$('.jobs_wrapper').empty();
		getRequest(baseUrl+"/recruiter/33765/candidates?status="+status ,{ }, populateSolarSearch);
		$(".main-container .saved-shortlisted-container").removeClass("hidden");
		$(".main-container .saved-shortlisted-container .select-options option[value="+status+"]").attr("selected","selected");
	}
	else {
		$('.jobs_wrapper').empty();
		getRequest(baseUrl+"/recruiter/33765/candidates" ,{ }, populateSolarSearch);
		$(".main-container .saved-shortlisted-container").removeClass("hidden");
		$(".main-container .saved-shortlisted-container .select-options option[value='']").attr("selected","selected");
	}

    //windowH();
	$("#download-excel").attr("href",baseUrl+"/recruiter/"+recruiterID+"/tag/"+tagId+"/export");
	$('.jobs_wrapper').on('click', 'a.icon' , performAction);

});

$(".jobs_wrapper").on('click','.button.list-all-applied-jobs', function() {
	console.log("hi")
	$(".jobs_wrapper").find(".slide-container[data-slide-id="+$(this).attr("data-slide-id")+"]").slideToggle();
})

$(".main-container").on('change','.saved-shortlisted-container .select-options select', function() {
	var value = $(this).val();
	console.log(value);
	if(value == '') {
		$('.jobs_wrapper').empty();
		getRequest(baseUrl+"/recruiter/33765/candidates" ,{ }, populateSolarSearch);
	}
	else if(value == 1 || value == 3){
		$('.jobs_wrapper').empty();
		getRequest(baseUrl+"/recruiter/33765/candidates?status="+value ,{ }, populateSolarSearch);
	}
})

var performAction = function(event) {
	event.preventDefault();
	event.stopPropagation();
	var hasClass = $(this).hasClass("highlighted");
	var dataAttribute = $(this).attr("data-attribute");
	if(!(hasClass)) {
		var applicationId = $(this).attr("data-application-id");

		var elem = $(this);
		postRequest(baseUrl+"/recruiter/"+recruiterID+"/action/"+jobId, null ,{
			action: dataAttribute,
			id: applicationId
		 }, function(res) {
		 	if(res["status"] == "success") {
				$(".jobs_wrapper .jobs_content[data-attribute=js-"+applicationId+"] .icon").removeClass("highlighted");
				console.log($(this));
				elem.addClass("highlighted");

		 	}
		});

	}
	if(dataAttribute == 4) {
		var redirectionLocation = $(this).attr("href");
		window.location = redirectionLocation;
	}
}

mainContainer.on("keyup",".solar-search",function(event) {
	console.log("hi");
	if(event.keyCode == 13){
		$('.jobs_wrapper').empty();
		getRequest(baseUrl+"/recruiter/33765/search/?queryStr="+$(this).val() ,{ }, populateSolarSearch);
    }
})

var populateSolarSearch = function(res) {

	if(res.status=="success"){
		console.log(res)
		$(".jobs-wrapper-shell-loader").addClass("hidden");
		var res = res["data"];
		res.forEach(function(aJob){
			var card = tableRow.clone().removeClass('prototype hidden');

			card.find(".user_name").text(aJob["name"]);
			card.find(".user_experience").text(getJobExperience(aJob["exp_y"], aJob["exp_m"]));
			card.find(".current_location").text(aJob["current_location"]);
			// card.find(".applied_date").text(ISODateToD_M_Y(aJob["apply_date"]));
			card.find(".user_sex").text(getTypeGender(aJob["sex"]));
			card.find(".user_age").text(getAge(aJob["dob"]));
			card.find(".notice-period").text("Notice: "+aJob["notice"]+" month");
			// card.find(".user_img").attr('src', aJob["imgUrl"]);

			card.find(".applied-jobs-container .list-all-applied-jobs").attr("data-slide-id",aJob["userID"]);
			if(aJob["appliedJobs"] ) {

				if( aJob["appliedJobs"].length == 1) {
					card.find(".applied-jobs-container-show").prepend("<div><a target='_blank' href='/profile/"+aJob["userID"]+"?jobID="+aJob["appliedJobs"][0]["jobID"]+"&jobTitle="+aJob["appliedJobs"][0]["title"]+"' class='font-sm link-color'>"+aJob["appliedJobs"][0]["title"]+"</a></div>").removeClass("hidden");

				}
				else if(aJob["appliedJobs"].length > 1) {
					aJob["appliedJobs"].forEach(function(aAppliedJob, index) {
						console.log(index)
						if(index == 0) {
							card.find(".applied-jobs-container-show").prepend("<div><a target='_blank' href='/profile/"+aJob["userID"]+"?jobID="+aJob["appliedJobs"][index]["jobID"]+"&jobTitle="+aJob["appliedJobs"][index]["title"]+"' class='link-color font-sm'>"+aAppliedJob["title"]+"</a></div>").removeClass("hidden");
							card.find(".applied-jobs-container .list-all-applied-jobs").text("+" +(aJob["appliedJobs"].length - 1) +" more");
						}
						else {
							card.find(".slide-container").append("<div><a target='_blank' href='/profile/"+aJob["userID"]+"?jobID="+aJob["appliedJobs"][index]["jobID"]+"&jobTitle="+aJob["appliedJobs"][index]["title"]+"' class='link-color'>"+aAppliedJob["title"]+"</a></div>");
						}
					})

					card.find(".applied-jobs-container").removeClass("hidden");
				}

				card.find(".slide-container").attr("data-slide-id",aJob["userID"]);
			}
			if(aJob["status"]) {

				var iconStatus = aJob["status"];
				var iconElements = card.find(".content_more .icon");
				iconElements.each(function(index,anElement){
					$(anElement).attr("data-application-id", aJob["id"]);
				});
				card.find(".content_more .icon[data-attribute= " + iconStatus + "]").addClass("highlighted");
				card.find(".content_more .icon[data-attribute=4]").attr("href","/profile/"+aJob["userID"]+"?jobID="+jobID+"&jobTitle="+jobTitle);

			}
			card.find(".icons-status").removeClass("hidden");
			var orgArray = aJob["jobs"];
			if(orgArray) {
				var len = orgArray.length;
				// var loop = len < 2 ? len:2;
				for(var i=0; i<len; i++) {
					var anOrg ={};
					anOrg = orgArray[i];
					var column = columnOrg.clone().removeClass('prototype hidden');
					column.find(".name").text(anOrg["organization"]);
					column.find(".designation").text(anOrg["designation"]);
					column.find(".extra_info").text(getOrgExp(anOrg["from_exp_month"],anOrg["from_exp_year"],anOrg["to_exp_month"],anOrg["to_exp_year"],anOrg["is_current"]));
					card.find('.content_organization').append(column);
				}
			}
			if(aJob["edu"]) {
				aJob["edu"].forEach(function(anEdu, index){
					// if(index > 1) {
					// 	return
					// }
					var column = columnIns.clone().removeClass('prototype hidden');

					column.find(".name").text(anEdu["institute"]);
					column.find(".start_duration").text(anEdu["batch_from"]);
					column.find(".end_duration").text(anEdu["batch_to"]);
					column.find(".degree").text(anEdu["degree"]);
					card.find('.content_institute').append(column);
				})
			}

			$('.jobs_container .jobs_wrapper').append(card);

		})
	}

}

function windowH() {

	var wH = $(window).height();
    console.log($('.main-container').height())
    if($('.main-container').height() < 634)
        {
	       $('.main-container').css({height: wH-'50'});
       }
}

var successCallback = function(res) {
    console.log(res);
}



var populateCandidates = function(res){

	if(res.status=="success"){
		console.log(res)
		$(".jobs-wrapper-shell-loader").addClass("hidden");

		var res = res["data"];


		res.forEach(function(aJob){
			var card = tableRow.clone().removeClass('prototype hidden');

			card.find(".user_name").text(aJob["name"]);
			card.find(".user_experience").text(getJobExperience(aJob["exp_y"], aJob["exp_m"]));
			card.find(".current_location").text(aJob["current_location"]);
			// card.find(".applied_date").text(ISODateToD_M_Y(aJob["apply_date"]));
			card.find(".user_sex").text(getTypeGender(aJob["sex"]));
			card.find(".user_age").text(getAge(aJob["dob"]));
			card.find(".notice-period").text("Notice: "+aJob["notice"]+" month");
			// card.find(".user_img").attr('src', aJob["imgUrl"]);
			// var iconStatus = aJob["status"];
			// var iconElements = card.find(".content_more .icon");
			// iconElements.each(function(index,anElement){
			// 	$(anElement).attr("data-application-id", aJob["id"]);
			// });
			// card.find(".content_more .icon[data-attribute= " + iconStatus + "]").addClass("highlighted");
			// card.find(".content_more .icon[data-attribute=4]").attr("href","/profile/"+aJob["userID"]+"?jobID="+jobID+"&jobTitle="+jobTitle);
			// card.find(".interview-invite.icon").attr("data-interview-invite","js-"+aJob['id']+"");
			// card.find(".slot-type-container").attr("data-interview-invite","js-"+aJob['id']+"");
			var orgArray = aJob["jobs"];
			if(orgArray) {
				var len = orgArray.length;
				//  var loop = len < 2 ? len:2;
				for(var i=0; i<len; i++) {
					var anOrg ={};
					anOrg = orgArray[i];
					var column = columnOrg.clone().removeClass('prototype hidden');
					column.find(".name").text(anOrg["organization"]);
					column.find(".designation").text(anOrg["designation"]);
					column.find(".extra_info").text(getOrgExp(anOrg["from_exp_month"],anOrg["from_exp_year"],anOrg["to_exp_month"],anOrg["to_exp_year"],anOrg["is_current"]));
					card.find('.content_organization').append(column);
				}
			}
			if(aJob["edu"]) {
				aJob["edu"].forEach(function(anEdu, index){
					// if(index > 1) {
					// 	return
					// }
					var column = columnIns.clone().removeClass('prototype hidden');

					column.find(".name").text(anEdu["institute"]);
					column.find(".start_duration").text(anEdu["batch_from"]);
					column.find(".end_duration").text(anEdu["batch_to"]);
					column.find(".degree").text(anEdu["degree"]);
					card.find('.content_institute').append(column);
				})
			}

			$('.jobs_container .jobs_wrapper').append(card);

		})
	}
}

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
  if (fromExpMonth < 10) {
	fromExpMonth = '0' + fromExpMonth;
  }
  if (toExpMonth < 10) {
	toExpMonth = '0' + toExpMonth;
  }
	 if(isCurrent == 1)
		str = fromExpMonth + " - " + fromExpYear + " to Present";
	 else
		str = fromExpMonth + " - " + fromExpYear + " to " + toExpMonth + " - " + toExpYear;
  return str;
}

function getJobExperience(expInYrs, expInMnth) {
  var total_exp = expInYrs + "y " +expInMnth + "m";
  return total_exp ;
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

var getUrlParameter = function getUrlParameter(sParam) {
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
