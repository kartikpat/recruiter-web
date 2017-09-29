var tagId

$(document).ready(function(){

	tagId = getUrlParameter('tagID');
    var tagName = getUrlParameter('tagName');

    $(".main-container .heading").text("Tag: "+tagName);

    getRequest(baseUrl+"/recruiter/"+recruiterID+"/tag/"+tagId+"/seekers" ,{ }, populateCandidates);

    //windowH();
});

$("#download-excel").click(function() {
    console.log("hi");
    getRequest(baseUrl+"/recruiter/"+recruiterID+"/tag/"+tagId+"/export" ,{ }, successCallback);
})

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

var tableRow = $(".jobs_content.prototype");
var columnOrg =  $(".organization.prototype");
var columnIns =  $(".institute.prototype");

var populateCandidates = function(res){

	if(res.status=="success"){
		console.log(res)
		$(".jobs-wrapper-shell-loader").addClass("hidden");
		// if(res["data"]["data"]) {
		// 	resultLength = res["data"]["data"].length;
		// 	$(".no-results").addClass("hidden");
		// }
		// else {
        //
		// 	$(".no-results").removeClass("hidden");
		// 	return;
		// }

		var res = res["data"];
		// jobs.find(".status_all").text(res["total"]);
		// jobs.find(".status_shortlisted").text(res["shortlisted"]);
		// jobs.find(".status_rejected").text(res["rejected"]);
		// jobs.find(".status_saved").text(res["save"]);
		// var unread = res["total"] - (res["shortlisted"] + res["rejected"] + res["save"]);
		// jobs.find(".status_unread").text(unread);
		// jobs.find(".status_sort").text(unread);

		res.forEach(function(aJob){
			var card = tableRow.clone().removeClass('prototype hidden');
			// card.attr("data-attribute",'js-'+aJob['id']+'');
			// card.find(".send-interview-invite").attr("data-user-id", aJob['userID']);
			card.find(".user_name").text(aJob["name"]);
			card.find(".user_experience").text(getJobExperience(aJob["exp_y"], aJob["exp_m"]));
			card.find(".current_location").text(aJob["current_location"]);
			// card.find(".applied_date").text(ISODateToD_M_Y(aJob["apply_date"]));
			card.find(".user_sex").text(aJob["sex"]);
			card.find(".user_age").text(getAge(aJob["dob"]));
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
			var len = orgArray.length;
			var loop = len < 2 ? len:2;
			for(var i=0; i<loop; i++) {
				var anOrg ={};
				anOrg = orgArray[i];
				var column = columnOrg.clone().removeClass('prototype hidden');
				column.find(".name").text(anOrg["organization"]);
				column.find(".designation").text(anOrg["designation"]);
				column.find(".extra_info").text(getOrgExp(anOrg["from_exp_month"],anOrg["from_exp_year"],anOrg["to_exp_month"],anOrg["to_exp_year"],anOrg["is_current"]));
				card.find('.content_organization').append(column);
			}
			aJob["edu"].forEach(function(anEdu, index){
				if(index > 1) {
					return
				}
				var column = columnIns.clone().removeClass('prototype hidden');

				column.find(".name").text(anEdu["institute"]);
				column.find(".start_duration").text(anEdu["batch_from"]);
				column.find(".end_duration").text(anEdu["batch_to"]);
				column.find(".degree").text(anEdu["degree"]);
				card.find('.content_institute').append(column);
			})
			// card.find(".icon-resume").attr("data-resume-open",'js-open-'+aJob['id']+'');
			// card.find(".resume-container").attr("data-resume-open",'js-open-'+aJob['id']+'');
			// card.find(".resume-container .resume-content").attr("data",aJob["resumeUrl"]);
			// var tagLine = aJob["about"];
			// if(tagLine) {
			// 	card.find(".tagline-content").text(tagLine);
			// }
			// else {
			// 	card.find(".tagline-container").addClass("hidden");
			// 	card.find(".tagline-divider").addClass("hidden");
			// }
			// card.find(".email-content").text(aJob["email"]);
			// var contactNo = aJob["phone"];
			// if(contactNo) {
			// 	card.find(".contact-content").text(contactNo);
			// }
			// else {
			// //	card.find(".contact").addClass("hidden");
			// }
            //
			// $("#submit-tag").attr("data-jobseeker-id",aJob["userID"]);
			// $("#submit-tag").attr("data-jobapplication-id",aJob["id"]);

			// card.find(".extra-info-container .maritalStatus").text(boolean(aJob["marital_status"]));
			// //card.find("extra-info-container .languages").text(formatLanguages(aJob["language_known"]));
			// card.find(".extra-info-container .permit").text(boolean(aJob["work_permit"]));
			// card.find(".extra-info-container .handleTeam").text(boolean(aJob["handle_team"]));
			// card.find(".extra-info-container .sixDayWorking").text(aJob[""]);
			// card.find(".extra-info-container .relocate").text(boolean(aJob["relocate"]));
			// card.find(".extra-info-container .differentlyAbled").text(boolean(aJob["differently_abled"]));
			// card.find(".extra-info-container .earlyStartup").text(boolean(aJob["early_startup"]));
			// card.find(".extra-info-container .travel").text(boolean(aJob["willing_travel"]));
			$('.jobs_container .jobs_wrapper').append(card);

		})
	}
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
