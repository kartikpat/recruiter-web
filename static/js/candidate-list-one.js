var modal = $(".modal");
var openModalBtn = $(".js-open-modal");
var closeModalBtn = $(".js-close-modal");
var filters = $(".filters");
var filtersModal = $(".filters-modal");
var jobContainer =$(".jobs_wrapper");
var calendarOption = $(".calendar-option.prototype");
var obj = {};
var tabId;
var jobId;
var jobTitle;
var viewProfileModal = $(".view-profile-modal");

var filterTagGroupNames = {
	industry: "Industry",
	funcArea: "Functional Area",
	location: "Current Location",
	prefLocation: "Preferred Location",
	institute: "Institute",
	minExp: "Minimum Experience",
	maxExp: "Maximum Experience",
	minBatch: "Minimum Batch",
	maxBatch: "Maximum Batch",
	minCTC: "Minimum CTC",
	maxCTC: "Maximum CTC",
	minAge: "Minimum Age",
	maxAge: "Maximum Age",
	sex: "Gender",
	notice: "Notice Period",
	applicationDate: "Application Date",
	lastActive: "Last Active",
	workPermit: "IsWorkPermit",
	handleTeam: "HasHandledTeam",
	relocate: "CanRelocate",
	diffAbled: "IsDifferentlyAbled",
	language: "Language Known"
}


/**
 * opens the respective modal depending upon the data-attribute passed through the clicked element
 * @return null
 */
var openModal = function() {
	var id = $(this).attr('data-attribute');
	var modal = $('.modal[data-attribute= ' + id + ']');
	modal.removeClass('hidden');
};

/**
 * closes the respective modal depending upon the data-attribute passed through the clicked element.
 * @return null
 */
var closeModal = function() {
	var id = $(this).attr('data-attribute');
	var modal = $('.modal[data-attribute= ' + id + ']');
	modal.addClass('hidden');
}

// $(window).click(function() {
// 	$(".resume-container").addClass("hidden");
// });

window.addEventListener('error', function(e) {
   // console.log(e);
}, true);

var createObject = function() {
	return {
		industry: (obj["industry"])? obj["industry"].join(","): null,
		location: (obj["location"])? obj["location"].join(","): null,
		prefLocation: (obj["prefLocation"])? obj["prefLocation"].join(","): null,
		institute: (obj["institute"])? obj["institute"].join(","): null ,
		minExp: obj["minExperience"],
		maxExp: obj["maxExperience"],
		minBatch: obj["minBatch"],
		maxBatch: obj["maxBatch"],
		minCTC: obj["minSalary"],
		maxCTC: obj["maxSalary"],
		minAge: obj["minAge"],
		maxAge: obj["maxAge"],
		sex: obj["gender"],
		notice: obj["noticePeriod"],
		applicationDate: obj["appliedDate"],
		lastActive: obj["lastSeen"],
		workPermit: obj["isWorkPermit"],
		handleTeam: obj["hasHandledTeam"],
		relocate: obj["canRelocate"],
		diffAbled: obj["isDifferentlyAbled"],
		language: obj["language"],
	};
}

var checkTabId = function(tabId, queryString) {
	if(tabId=='magicsort'){
	  queryString["sortBy"] = 1;
	}
	else if(tabId==-1 || (tabId>0 && tabId <4)){
	  queryString["status"] = tabId;
	}
	return queryString;
}

var loadViewByDataWrapper = function(tabId) {
	var queryString = {};
	pageNumber = 1;
	queryString = createObject();
	queryString = checkTabId(tabId, queryString)
	queryString["pageContent"] = pageContent;
	queryString["pageNumber"] = pageNumber;
	return queryString;
}

var loadViewByDataByTab = function() {
	$('.jobs-wrapper-shell-loader').removeClass('hidden');
	tabId = $(this).attr('data-attribute');
	var queryString = loadViewByDataWrapper(tabId);
	//console.log(queryString);
	viewByOptions.removeClass("highlight");
	$(this).addClass("highlight");
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+jobId, queryString, populateJobs)
	$('.jobs_wrapper').empty();
}

var loadViewByData = function(status) {
	$('.jobs-wrapper-shell-loader').removeClass('hidden');
	tabId = status;
	var queryString = loadViewByDataWrapper(tabId);
	//console.log(queryString);
	viewByOptions.removeClass("highlight");
	$(".stat[data-attribute="+tabId+"]").addClass("highlight");
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+jobId, queryString, populateJobs)
	$('.jobs_wrapper').empty();
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

var submitFilters = function() {
	//console.log(tabId);
	$('.jobs-wrapper-shell-loader').removeClass('hidden');
	var queryString = loadViewByDataWrapper(tabId);
	//console.log(queryString);
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+jobId, queryString, populateJobs);
	$('.jobs_wrapper').empty();
	var id = $(this).attr('data-attribute');
	var modal = $('.modal[data-attribute= ' + id + ']');
	modal.addClass('hidden');
}

//var baseUrl = "http://13.126.92.102:8000"
//var baseUrl = "http://192.168.86.162:8000";
var recruiterID = localStorage.id;
var jobs = $(".jobs");
var tableRow = $(".jobs_content.prototype");
var columnOrg =  $(".organization.prototype");
var columnIns =  $(".institute.prototype");
var tags = $(".tags.prototype");
var tagsWrapper = $(".tags-wrapper.prototype");
var viewByOptions = $(".jobs .menu .stat");
var pageNumber = 1;
var pageContent = 10;

var showCheckboxFilter = function() {
	var id = $(this).attr('class');
	var att = $(this).attr('data-att');
	$(".row.js-"+att+" input").parent().addClass("invisible");
	$(".row.js-"+att+" span").addClass("invisible");
	var elements = $(".row.js-"+att+" input."+id+"");
	var spanElement = $(".row.js-"+att+" span."+id+"");
	elements.each(function(index,anElement){
		$(anElement).parent().removeClass("invisible");
	});
	$(spanElement).removeClass("invisible")
}

var hideCheckboxFilter = function() {
	var att = $(this).attr('data-att');
	$(".row.js-"+att+" input").parent().removeClass("invisible");
	$(".row.js-"+att+" span").removeClass("invisible");
}

var slideToThatFilter = function(event) {
	event.preventDefault();
	var href = $(this).attr('href');
	jQuery(".modal-bottom").scrollLeft($(href)[0].offsetLeft - 30);
}

var populateTags = function(sorted,metaData) {

	var j = 0;
	var flag = 0;
	var count = 0;
	var dataAttribute = metaData["data-attribute"];
	var name = metaData["name"];
	for(var i = 0; j < sorted.length; i++) {
		 var obj = sorted[j];
		 if(!(i%10)) {
 			var tagsWrapperClone = tagsWrapper.clone().removeClass('prototype hidden');
 			$(".row.js-"+dataAttribute+"").append(tagsWrapperClone);
			count++;
 		}
		if((flag==0) && (!sorted[j-1] || obj["text"].charAt(0) != sorted[j-1]["text"].charAt(0))) {
			flag=1;
			aCharacter = obj["text"].charAt(0);
			tagsWrapperClone.append('<span id="'+dataAttribute+'-'+aCharacter+'" class="'+dataAttribute+'-alphabet-hover-'+aCharacter+'" >'+aCharacter+'</span>');
			$(".tags-alphabets.tags-alphabets-"+dataAttribute+"").append('<li><a href="#'+dataAttribute+'-'+aCharacter+'" class="'+dataAttribute+'-alphabet-hover-'+aCharacter+'" data-attribute="alphabet-hover" data-att = "'+dataAttribute+'">'+aCharacter+'</a></li>');
			continue;
		}
		var tagCheckbox = tags.clone().removeClass('prototype hidden');
		tagCheckbox.find(".label").append('<input id="'+dataAttribute+ "-" +obj["text"]+'" type="checkbox" value="'+obj["val"]+'" name="'+name+'" class="'+dataAttribute+'-alphabet-hover-'+aCharacter+'">'+ obj["text"]);
		tagCheckbox.find(".label").attr("for", dataAttribute + "-" + obj["text"]);
		tagsWrapperClone.append(tagCheckbox);
		flag=0;
		j++;
	}
	var widt = count * 300;
	$(".row.js-"+dataAttribute+"").width(widt);
}

var populateMainTags = function(sorted,metaData) {
	var dataAttribute = metaData["data-attribute"];
	var name = metaData["name"];
	$.each(sorted, function(index, value) {
		if(index > 4){
			return
		}
		var obj = sorted[index];
		var tagCheckbox = tags.clone().removeClass('prototype hidden');
		tagCheckbox.find(".label").append('<input id="'+dataAttribute+ "-"+obj["text"]+'" type="checkbox" value="'+obj["val"]+'" name="'+name+'">'+ obj["text"]);
		tagCheckbox.find(".label").attr("for", dataAttribute + "-" + obj["text"]);
		tagCheckbox.find(".label").addClass("checkboxes");
		$('.js-tags[data-attribute='+dataAttribute+']').append(tagCheckbox);
	})
}

// var performAction = function(event) {
// 	event.preventDefault();
// 	event.stopPropagation();
// 	var hasClass = $(this).hasClass("highlighted");
// 	var dataAttribute = $(this).attr("data-attribute");
// 	if(!(hasClass)) {
// 		var applicationId = $(this).attr("data-application-id");
//
// 		var elem = $(this);
// 		postRequest(baseUrl+"/recruiter/"+recruiterID+"/action/"+jobId, null ,{
// 			action: dataAttribute,
// 			id: applicationId
// 		 }, function(res) {
// 		 	if(res["status"] == "success") {
// 				$(".jobs_wrapper .jobs_content[data-attribute=js-"+applicationId+"] .icon").removeClass("highlighted");
// 				// console.log($(this));
// 				elem.addClass("highlighted");
// 		// 	// if(tabId!= '') {
// 		// 	// 	// c$(".jobs_content[data-attribute=js-"+applicationId+"]").addClass("remove");
// 		// 	// 	//$(".jobs_content[data-attribute=js-"+applicationId+"]").css("background","red")
// 		// 	// }
// 		// 	$('.jobs-wrapper-shell-loader').removeClass('hidden');
// 		// 	var queryString = createObject();
// 		// 	queryString = checkTabId(tabId, queryString);
// 		// 	queryString["pageContent"] = pageContent;
// 		// 	$('.jobs_wrapper').empty();
// 		// 	for(var i = 1; i <= pageNumber; i++ ) {
// 		// 		queryString["pageNumber"] = i;
// 		// 		getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+jobId, queryString, populateJobs);
// 		// 	}
// 		 	}
// 		});
//
// 	}
// 	if(dataAttribute == 4) {
// 		var redirectionLocation = $(this).attr("href");
// 		window.location = redirectionLocation;
// 	}
// }

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
				// $(".jobs_wrapper .jobs_content[data-attribute=js-"+applicationId+"] .icon").removeClass("highlighted");
				// // console.log($(this));
				// elem.addClass("highlighted");
		// 	// if(tabId!= '') {
		// 	// 	// c$(".jobs_content[data-attribute=js-"+applicationId+"]").addClass("remove");
		// 	// 	//$(".jobs_content[data-attribute=js-"+applicationId+"]").css("background","red")
		// 	// }
		// 	$('.jobs-wrapper-shell-loader').removeClass('hidden');
		// 	var queryString = createObject();
		// 	queryString = checkTabId(tabId, queryString);
		// 	queryString["pageContent"] = pageContent;
		// 	$('.jobs_wrapper').empty();
		// 	for(var i = 1; i <= pageNumber; i++ ) {
		// 		queryString["pageNumber"] = i;
		// 		getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+jobId, queryString, populateJobs);
		// 	}
        getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+jobId, {}, populateTabs);
        console.log(tabId)
        if(tabId!= '') {
            $(".jobs_wrapper .jobs_content[data-attribute=js-"+applicationId+"]").slideUp(300);
        }
        else {
            $(".jobs_wrapper .jobs_content[data-attribute=js-"+applicationId+"] .icon").removeClass("highlighted");
            elem.addClass("highlighted");
        }
		var aCandidate = candidatesMap[applicationId];
		aCandidate["status"] = dataAttribute;
		console.log(aCandidate);
		 	}
		});

	}
	if(dataAttribute == 4) {
		var redirectionLocation = $(this).attr("href");
		window.location = redirectionLocation;
	}
}

var populateTabs = function(res) {
    if(res["status"] == "success") {
        var res = res["data"];
        jobs.find(".status_all").text(res["total"]);
        jobs.find(".status_shortlisted").text(res["shortlisted"]);
        jobs.find(".status_rejected").text(res["rejected"]);
        jobs.find(".status_saved").text(res["save"]);
        var unread = res["total"] - (res["shortlisted"] + res["rejected"] + res["save"]);
        jobs.find(".status_unread").text(unread);
        jobs.find(".status_sort").text(unread);
    }
}

viewProfileModal.on('click','.buttons .icon-status',function(event) {

		event.preventDefault();
		var hasClass = $(this).hasClass("highlighted");
		if(!(hasClass)) {
			var applicationId = $(this).attr("data-application-id");
			console.log(applicationId);
			 var dataAttribute = $(this).attr("data-attribute");
			postRequest(baseUrl+"/recruiter/"+recruiterID+"/action/"+jobId, null ,{
				action: dataAttribute,
				id: applicationId
			}, function(res) {
				if(res["status"] == "success") {
					viewProfileModal.find(".buttons .icon-status").removeClass("highlighted")
					viewProfileModal.find(".buttons .icon-status[data-attribute="+ dataAttribute +"]").addClass("highlighted");
					var aCandidate = candidatesMap[applicationId];
					aCandidate["status"] = dataAttribute;
					console.log(aCandidate);
					getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+jobId, {}, populateTabs);
					if(tabId!= '') {
			            $(".jobs_wrapper .jobs_content[data-attribute=js-"+applicationId+"]").slideUp(300);
			        }
			        else {
			            $(".jobs_wrapper .jobs_content[data-attribute=js-"+applicationId+"] .icon").removeClass("highlighted");
			            $(".jobs_wrapper .jobs_content[data-attribute=js-"+applicationId+"] .icon[data-attribute="+dataAttribute+"]").addClass("highlighted");
			        }

				}
			})
		// }
	}
});



// var showDotLoader = function() {
// 	$(".dot-loader-container").removeClass("hidden");
// 	profileContainer.find(".buttons").addClass("extra-height");
// }
//
// var hideDotLoader = function() {
// 	$(".dot-loader-container").addClass("hidden");
// 	profileContainer.find(".buttons").removeClass("extra-height");
// }



var performViewIcon = function(event) {

	event.stopPropagation();
	var hasClass = $(this).hasClass("highlighted");
	var dataAttribute = $(this).attr("data-attribute");
	if(!(hasClass) && tabId != 1 && tabId != 2 && tabId != 3) {
		var applicationId = $(this).attr("data-application-id");

		var elem = $(this);
		postRequest(baseUrl+"/recruiter/"+recruiterID+"/action/"+jobId, null ,{
			action: dataAttribute,
			id: applicationId
		 }, function(res) {
		 	if(res["status"] == "success") {
				$(".jobs_wrapper .jobs_content[data-attribute=js-"+applicationId+"] .icon").removeClass("highlighted");
				// console.log($(this));
				elem.addClass("highlighted");
		// 	// if(tabId!= '') {
		// 	// 	// c$(".jobs_content[data-attribute=js-"+applicationId+"]").addClass("remove");
		// 	// 	//$(".jobs_content[data-attribute=js-"+applicationId+"]").css("background","red")
		// 	// }
		// 	$('.jobs-wrapper-shell-loader').removeClass('hidden');
		// 	var queryString = createObject();
		// 	queryString = checkTabId(tabId, queryString);
		// 	queryString["pageContent"] = pageContent;
		// 	$('.jobs_wrapper').empty();
		// 	for(var i = 1; i <= pageNumber; i++ ) {
		// 		queryString["pageNumber"] = i;
		// 		getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+jobId, queryString, populateJobs);
		// 	}
		 	}
		});

	}

}



jobContainer.on('click','.jobs_content .send-interview-invite', function(event){
	event.preventDefault();
	event.stopPropagation();
	var slotType = $(this).attr("data-attribute");
	var seekerId = $(this).attr("data-user-id");
	var elem = $(this);
	postRequest(baseUrl+"/recruiter/"+recruiterID+"/calendar/"+calendarId+"/invite/"+jobId, null ,{
		seekerID: seekerId,
		slotType: slotType
	}, function(res) {
		// console.log(res);
		if(res["status"] == "success") {
			elem.parent().parent().addClass("hidden");
			if(slotType == 1) {
				elem.parent().parent().next().text("Face to Face interview invitation sent").removeClass("hidden");
			}
			else if(slotType == 2){
				elem.parent().parent().next().text("Telephonic interview interview sent").removeClass("hidden");
			}
		}
	});
})



jobContainer.on('mouseover','.jobs_content .interview-invite.icon', function(event){
	var dataInterviewInvite = $(this).attr("data-interview-invite");
	jobContainer.find('.slot-type-container[data-interview-invite='+dataInterviewInvite+']').removeClass("hidden");
})

jobContainer.on('mouseout','.jobs_content .interview-invite.icon', function(){
 	var dataInterviewInvite = $(this).attr("data-interview-invite");
 	jobContainer.find('.slot-type-container[data-interview-invite='+dataInterviewInvite+']').addClass("hidden");
})

jobContainer.on('mouseover','.jobs_content .resend-interview-invite.icon', function(event){
	var dataInterviewInvite = $(this).attr("data-interview-invite");
	jobContainer.find('.slot-type-container[data-interview-invite='+dataInterviewInvite+']').removeClass("hidden");
})

jobContainer.on('mouseout','.jobs_content .resend-interview-invite.icon', function(){
 	var dataInterviewInvite = $(this).attr("data-interview-invite");
 	jobContainer.find('.slot-type-container[data-interview-invite='+dataInterviewInvite+']').addClass("hidden");
})



$(document).ready(function(){
	var urlObject = fetchURL();
	var res = urlObject["pathname"].split("/");

	if(!(isNaN(res[2]))){
		jobId = res[2];
	}

	jobTitle = getUrlParameter('title');
	if(jobTitle && jobId) {
		$(".job-heading").text("Job : "+jobId+" , "+jobTitle+"");
	}

	populateTags(industryTagsData, industryMetaData);
	populateTags(languageTagsData,languageMetaData);
	populateTags(functionalAreaTagsData, functionalAreaMetaData);
	populateTags(instituteTagsData, instituteMetaData);
	populateTags(currentLocationTagsData, currentLocationMetaData);
	populateTags(prefeLocationTagsData, preferredLocationMetaData);

	populateMainTags(industryTagsData, industryMetaData);
	populateMainTags(languageTagsData,languageMetaData);
	populateMainTags(functionalAreaTagsData, functionalAreaMetaData);
	populateMainTags(instituteTagsData, instituteMetaData);
	populateMainTags(currentLocationTagsData, currentLocationMetaData);
	populateMainTags(prefeLocationTagsData, preferredLocationMetaData);


	openModalBtn.click(openModal);
	closeModalBtn.click(closeModal);
	viewByOptions.click(loadViewByDataByTab);

	$(".submit-filters").click(submitFilters);

	$(".search-tags-menu-industry").on('input', function(){
		var ele = this;
		searchTags(industryTagsData, industryMetaData, ele);
	});
	$(".search-tags-menu-functional-area").on('input',function(){
		var ele = this;
		searchTags(functionalAreaTagsData, functionalAreaMetaData, ele);
	});
	$(".search-tags-menu-current-location").on('input',function(){
		var ele = this;
		searchTags(currentLocationTagsData, currentLocationMetaData, ele);
	});
	$(".search-tags-menu-preferred-location").on('input',function(){
		var ele = this;
		searchTags(prefeLocationTagsData, preferredLocationMetaData, ele);
	});
	$(".search-tags-menu-institute").on('input',function(){
		var ele = this;
		searchTags(instituteTagsData, instituteMetaData, ele);
	});
	$(".search-tags-menu-languages").on('input',function(){
		var ele = this;
		searchTags(languageTagsData,languageMetaData, ele);
	});




	var status = getUrlParameter('status');
	if(status) {
		loadViewByData(status);
	}
	else {
		$('.jobs-wrapper-shell-loader').removeClass('hidden');
		getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+jobId, {
		  pageContent: pageContent,
		  pageNumber: pageNumber
	  	}, populateJobs)
		tabId = '';
	}
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/calendar/"+jobId, {} , populateCalendarOptions );
	//
	//console.log(calendarId);
	$(".set-default-calendar-button").click(setDefaultCalendar)

	$("#search-by-keyword-button").click(searchByKeyword);

		// $('#slider-down').click(function() {
		// 	$(this).addClass("hidden");
		// 	$("#slider-up").removeClass("hidden");
		//   	$('.more_info').slideToggle();
		// });
	// $('#slider-up').click(function() {
	// 	$(this).addClass("hidden");
	// 	$("#slider-down").removeClass("hidden");
	//   	$('.more_info').slideToggle();
	// });



});

$(".jobs_wrapper").on('click','.download-icon',function(event){
	// event.preventDefault();
	event.stopPropagation();
	// window.location = $(this).attr("data-href");
});



$(".jobs_wrapper").on('click','.content-container', function() {
	var dataAttribute = $(this).parent().attr('data-attribute');
	var userId = dataAttribute.substring(3,dataAttribute.length)
	// console.log(userId);
	// getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+jobId, {
	// 	userID: userId
	// }, storeProfile)
	var aJob = candidatesMap[userId];

	console.log(aJob);
	// getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+jobId, {
	// 	userID: anObj["userID"]
	// }, function(res) {
	// 	if(res["status"] == "success") {
	// 		var aJob = res["data"]["data"][0];
			viewProfileModal.attr("data-application-id", userId);
			viewProfileModal.find(".close-overlay-profile-modal").attr("data-application-id", userId);


			if(aJob["email"]) {
				viewProfileModal.find(".userDetail .email").html(aJob["email"]+"<span class='important-info-color'> (Verified)</span>").removeClass("animated-background");
			}
			else {
				viewProfileModal.find(".userDetail .email").addClass("hidden");
			}
			if(aJob["phone"]) {
				viewProfileModal.find(".userDetail .contact").html(aJob["phone"]+"<span class='important-info-color'> (Verified)</span>");
			}
			else {
				viewProfileModal.find(".userDetail .contact").addClass("hidden");
			}
			viewProfileModal.find(".userDetail .name").text(aJob["name"]);
			viewProfileModal.find(".extraInfo .experience").text("Experience: "+aJob["exp_y"]+"y "+aJob["exp_m"]+"m");
			viewProfileModal.find(".extraInfo .location").text("Location: "+aJob["current_location"]);
			if(aJob["notice"] > 6) {
				viewProfileModal.find(".userDetail .notice").text("Notice: Immediately Available");
			}
			else {
				viewProfileModal.find(".userDetail .notice").text("Notice: "+aJob["notice"]+ " months");
			}
			viewProfileModal.find(".userDetail .user_img").attr("src", aJob["imgUrl"]);
			viewProfileModal.find(".userDetail .sex").text(getTypeGender(aJob["sex"]));
			viewProfileModal.find(".userDetail .age").text(getAge(aJob["dob"]) + " years");
			viewProfileModal.find(".userDetail .last-login").text("Last Login: "+ISODateToD_M_Y(aJob["last_active_date"]));
			viewProfileModal.find(".userDetail .applyDate").text("Applied: "+ISODateToD_M_Y(aJob["apply_date"]));
			// card.find(".shell-loader-container").addClass("hidden");
			//profileContainer.find(".userDetail .applyDate").text(data["apply_date"]);
			if(aJob["pref_location"]) {
				viewProfileModal.find(".extraInfo .prefLocation").text("Preferred Location: "+aJob["pref_location"]);
			}
			else {
				viewProfileModal.find(".extraInfo .prefLocation").text("Preferred Location: Not Specified");
			}

			var curSalary = (aJob["current_ctc"])? aJob["current_ctc"]+" Lakhs": "confidential";
			viewProfileModal.find(".extraInfo .currentCTC").text("Current Salary: "+ curSalary);
			var expSalary = (aJob["expected_ctc"])? aJob["expected_ctc"]+" Lakhs": "confidential";
			viewProfileModal.find(".extraInfo .expectedCTC").text("Expected Salary: "+ expSalary);

			viewProfileModal.find(".moreInfo .maritalStatus").text(boolean(aJob["marital_status"]));
			if(aJob["language_known"]!= "") {
				viewProfileModal.find(".moreInfo .languages").text(formatLanguages(aJob["language_known"]));
			}
			else {
				viewProfileModal.find(".moreInfo .languages").text("nil");
			}
			viewProfileModal.find(".moreInfo .permit").text(boolean(aJob["work_permit"]));
			viewProfileModal.find(".moreInfo .handleTeam").text(boolean(aJob["handle_team"]));
			//profileContainer.find(".moreInfo .sixDayWorking").text(data[""]);
			viewProfileModal.find(".moreInfo .relocate").text(boolean(aJob["relocate"]));
			viewProfileModal.find(".moreInfo .differentlyAbled").text(boolean(aJob["differently_abled"]));
			viewProfileModal.find(".moreInfo .earlyStartup").text(boolean(aJob["early_startup"]));
			viewProfileModal.find(".moreInfo .travel").text(boolean(aJob["willing_travel"]));
			if(aJob["about"]!= "") {
				viewProfileModal.find(".moreInfo .about").text(boolean(aJob["about"]));
			}
			else {
				viewProfileModal.find(".moreInfo .about").addClass("hidden");
			}

			var status = aJob["status"];
			console.log(status);
				viewProfileModal.find(".buttons .ico").removeClass("highlighted");
				viewProfileModal.find(".buttons .ico[data-attribute="+ status +"]").addClass("highlighted");
			viewProfileModal.find(".buttons .icon-status").attr("data-application-id",aJob["id"]);
			viewProfileModal.find(".profile_content .organization").empty();
			aJob["jobs"].forEach(function(aJob, index){

				var cardtemp = $(".jobCard.prototype").clone().removeClass('prototype hidden');
				cardtemp.find(".name").text(aJob["organization"])
				cardtemp.find(".designation").text(aJob["designation"]);
				cardtemp.find(".extra_info").text(getOrgExp(aJob["from_exp_month"],aJob["from_exp_year"],aJob["to_exp_month"],aJob["to_exp_year"],aJob["is_current"]));

				viewProfileModal.find(".profile_content .organization").append(cardtemp);
			})

			viewProfileModal.find('.profile_content .institute').empty();

			aJob["edu"].forEach(function(anEdu,index){

				var column = $(".instituteCard.prototype").clone().removeClass('prototype hidden');

				column.find(".name").text(anEdu["institute"]);
				column.find(".start_duration").text(anEdu["batch_from"]);
				column.find(".end_duration").text(anEdu["batch_to"]);
				column.find(".degree").text(anEdu["degree"]);

				viewProfileModal.find('.profile_content .institute').append(column);
			})

			viewProfileModal.find('.content.more .posted-tags').empty();

			aJob["tags"].forEach(function(anTag, index){

				var divEl = $('.tags-jobSeeker.prototype').clone().removeClass('prototype hidden');
				divEl.find(".tags-content").attr("data-tag-name",anTag["name"]);
				divEl.find(".tags-content").attr("data-id",anTag["id"]);
				divEl.find(".tags-content").attr("data-jobseeker-id",aJob['userID']);
				divEl.find(".tags-content").attr("data-jobapplication-id",aJob['id']);
				divEl.find(".tags-content").text(anTag["name"]);
				divEl.find(".tags-content").addClass(' margin-right font-sm');
				divEl.find(".js-remove-tag").attr("data-id",anTag["id"]);
				divEl.find(".js-remove-tag").attr("data-jobseeker-id",aJob['userID']);
				divEl.find(".js-remove-tag").attr("data-jobapplication-id",aJob['id']);

				viewProfileModal.find('.content.more .posted-tags').append(divEl);
			})
			viewProfileModal.find(".submit-comment").attr("data-job-seeker-id",aJob["userID"]);
			viewProfileModal.find(".submit-comment").attr("data-application-id",aJob["id"]);
			viewProfileModal.find(".submit-tag").attr("data-jobseeker-id",aJob["userID"]);
			viewProfileModal.find(".submit-tag").attr("data-jobapplication-id",aJob["id"]);
			if(aJob["comment"]) {
				viewProfileModal.find(".add-comment").val(aJob["comment"]);
				viewProfileModal.find(".submit-comment").text("Update");
			}
			else {
				viewProfileModal.find(".submit-comment").text("Comment");
			}
				viewProfileModal.find(".contact-info .email").text(aJob["email"]);
			if(aJob["phone"]) {
				viewProfileModal.find(".contact-info .contact").text(aJob["phone"]);
			}
			else {
				viewProfileModal.find(".info.phone").addClass("hidden");
			}

			// PDFJS.getDocument("https://cdn.mozilla.net/pdfjs/helloworld.pdf").then(function(pdf) {
			//   console.log(pdf.numPage);
			// });
			// if(isCanvasSupported()) {
			// 	getBinaryData("https://cdn.mozilla.net/pdfjs/tracemonkey.pdf",resumeCallback);
			// }
			// else {
				viewProfileModal.find(".resume-embed-container").empty();
				var url = "https://s3.ap-south-1.amazonaws.com/pat-resume-bucket/Resume.pdf"
				viewProfileModal.find(".resume-embed-container").html('<embed src="'+url+'" class="resume-embed" type="application/pdf"></embed>')



			// viewProfileModal.find(".resume-overlay").remove();
			// viewProfileModal.find(".resume-container").append("<div class='resume-overlay'></div>");
			if(aJob["cover_text"]) {
				var coverText = aJob["cover_text"];
				viewProfileModal.find(".cover_content").text(coverText);
				viewProfileModal.find(".cover_letter	").removeClass("hidden");
				viewProfileModal.find(".resume").removeClass("no-cover-but-resume");
			}
			else{
				viewProfileModal.find(".cover_letter	").addClass("hidden");
				viewProfileModal.find(".resume").addClass("no-cover-but-resume");
			}

			viewProfileModal.removeClass('hidden');
			 $(document.body).addClass("overflow-hidden");
	// 	}
	//
	// })


	// $(".jobs_content[data-attribute="+dataAttribute+"] .divider.prototype").toggleClass('hidden');
	// $(".jobs_content[data-attribute="+dataAttribute+"] .content_organization .organisation-hidden").toggleClass('hidden');
	// $(".jobs_content[data-attribute="+dataAttribute+"]").toggleClass('overlay-show');
});

function resumeCallback(res){
    console.log(res)
    PDFJS.getDocument(res).then(function getPdfHelloWorld(_pdfDoc) {
     var numPages = _pdfDoc.pdfInfo.numPages;
     console.log(numPages);

        for(var i = 1; i <= numPages; i++) {
            _pdfDoc.getPage(i).then(function(page) {
                var scale = 1.5;
                var viewport = page.getViewport(scale);
                viewProfileModal.find(".resume-embed-container").append("<canvas id='canvas-"+page.pageIndex+"'></canvas>");
                var canvas = document.getElementById("canvas-"+page.pageIndex+"");
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render PDF page into canvas context
                var renderContext = {
                  canvasContext: context,
                  viewport: viewport
                };
                var renderTask = page.render(renderContext);
                renderTask.then(function () {
                  console.log('Page rendered');
                });
         });
        }
    });

}

viewProfileModal.on('click','.close-overlay-profile-modal', function() {
	// var dataAttribute = $(this).attr('data-application-id');
	// var userId = dataAttribute.substring(3,dataAttribute.length)
	// console.log(userId);
	// getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+jobId, {
	// 	userID: userId
	// }, storeProfile)

	 viewProfileModal.addClass('hidden');
	 $(document.body).removeClass("overflow-hidden");
	// $(".jobs_content[data-attribute="+dataAttribute+"] .divider.prototype").toggleClass('hidden');
	// $(".jobs_content[data-attribute="+dataAttribute+"] .content_organization .organisation-hidden").toggleClass('hidden');
	// $(".jobs_content[data-attribute="+dataAttribute+"]").toggleClass('overlay-show');
});

viewProfileModal.on('click','.slider-down',function(){
	$(this).addClass("hidden");
	$(this).next().removeClass("hidden");
	viewProfileModal.find(".more_info").slideToggle();
})

viewProfileModal.on('click','.slider-up',function(){
	$(this).addClass("hidden");
	$(this).prev().removeClass("hidden");
	viewProfileModal.find(".more_info").slideToggle();
})

viewProfileModal.on("keyup", '.add-tag', function() {
	var string = $(this).val();
	// console.log(string);
	var elem = $(this);
	if(string != '') {
		getRequest(baseUrl+"/recruiter/"+recruiterID+"/tag?str="+string, {} , function(res) {
			if(res.status == "success") {
				var suggestedTagsArray = [];
				res["data"].forEach(function(aTag) {
					suggestedTagsArray.push({
						"label": aTag["name"],
						"value": aTag["name"],
						"id": aTag["id"]
				});
			})
				elem.autocomplete({
			      source: suggestedTagsArray,
				  select: function (event, ui) {
					  $(this).attr("tag-id", ui.item.id);
				  }
			  });
			}
		});
	}
})

viewProfileModal.on("click", '.tags-jobSeeker .tags-content', function() {
	var dataId = $(this).attr("data-id");
	var dataName = $(this).attr("data-tag-name");
	window.location = "/recruiter/filter-candidate?tagID="+dataId+"&tagName="+dataName;
})

viewProfileModal.on("click", '.submit-tag', function() {
	var obj = {};
	obj["name"] = $(this).prev().val();
	$(this).prev().val('');
	var tagId = $(this).prev().attr("tag-id");
	if(tagId != '') {
		obj["id"] = tagId;
	}
	obj["seekerID"] = $(this).attr("data-jobseeker-id");
	obj["applicationID"] = $(this).attr("data-jobapplication-id");
	// console.log(obj);
	if(obj["name"] != '') {
		postRequest(baseUrl+"/recruiter/"+recruiterID+"/tag", null ,
		obj, function(res) {
				if(res["status"] == "success") {
					console.log(res);
					if(res["data"] != null) {
						tagId = res["data"];
					}
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

					viewProfileModal.find('.content.more .posted-tags').append(divEl);
					var aCandidate = candidatesMap[obj["applicationID"]]
					var addTagToCandidate = {
						"name":obj["name"],
						"id": tagId
					}
					aCandidate["tags"].push(addTagToCandidate);

				}
		});



	}

})

viewProfileModal.on("keypress", '.add-tag', function(event) {
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
		// console.log(obj);
		if(obj["name"] != '') {
			postRequest(baseUrl+"/recruiter/"+recruiterID+"/tag", null ,
			obj, function(res) {
					if(res["status"] == "success") {
						if(res["data"] != null) {
							tagId = res["data"];
						}
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

						viewProfileModal.find('.content.more .posted-tags').append(divEl);
						var aCandidate = candidatesMap[obj["applicationID"]]
						var addTagToCandidate = {
							"name":obj["name"],
							"id": tagId
						}
						aCandidate["tags"].push(addTagToCandidate);
						console.log(aCandidate["tags"]);
					}
			});



		}
	}

})

// $(".jobs_wrapper").on("click", '.posted-tags .tags-content', function() {
//
// });

viewProfileModal.on("click", '.js-remove-tag.job-seeker-tags', function() {
	var tagId = $(this).attr("data-id");
	var obj = {}
	obj["seekerID"] = $(this).attr("data-jobseeker-id");
	obj["applicationID"] = $(this).attr("data-jobapplication-id");
	var elem = $(this);

	postRequest(baseUrl+"/recruiter/"+recruiterID+"/tag/"+tagId+"/delete", null ,
	obj, function(res) {
			if(res["status"] == "success") {
				// console.log("hi");

				elem.parent().remove();
				var aCandidate = candidatesMap[obj["applicationID"]]
				var removeTagFromCandidate = search(tagId, aCandidate["tags"]);
				console.log(removeTagFromCandidate);
				remove(aCandidate["tags"], removeTagFromCandidate);
				console.log(aCandidate["tags"]);
			}
	});

})

function search(nameKey, myArray){
	for (var i=0; i < myArray.length; i++) {
		if (myArray[i].id == nameKey) {

			return myArray[i];
		}
	}
}

function remove(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
}



// var populateTags = function(res) {
// 	console.log(res);
// }

var searchByKeyword = function() {
	var searchStr = $("#search-by-keyword").val();

	if(searchStr!= '') {
		$('.jobs-wrapper-shell-loader').removeClass('hidden');
		$('.jobs_wrapper').empty();
		getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+jobId+"?searchString="+searchStr ,{ }, populateJobs);
	}
}

var setDefaultCalendar = function() {
	calendarId = $(".calendar-select option:selected").val();
	var defaultCalendarId = $(this).attr("data-default");
	//console.log(defaultCalendarId);
	postRequest(baseUrl+"/recruiter/"+recruiterID+"/calendar/"+jobId+"/default/"+calendarId, null ,{
		defaultCalendarID: defaultCalendarId
	}, successCallback);
}

var successCallback = function(res){
    // console.log(res);
}

filtersModal.on('change','input[type="checkbox"]', function(){
	var name = $(this).attr('name');
	var tagsArray = [];
	var checkedElements = filtersModal.find('input[name="'+name+'"]:checked');
	var uncheckedElements = filtersModal.find('input[name="'+name+'"]:not(:checked)');
	checkedElements.each(function(index,anElement){
		var value = anElement.value;
		filters.find('input[name="'+name+'"][value="'+value+'"]').prop('checked', true);
		tagsArray.push(value);
	});
	uncheckedElements.each(function(index,anElement){
		var value = anElement.value;
		filters.find('input[name="'+name+'"][value="'+value+'"]').prop('checked', false);
	});
	obj[name] = tagsArray;
	if(obj[name].length == 0) {
		delete obj[name];
	}
	//console.log(obj);
	showFilterTags(obj);
});

filters.on('change','input[type="checkbox"]', function(){
	var name = $(this).attr('name');
	var tagsArray = [];
	var checkedElements = filters.find('input[name="'+name+'"]:checked');
	// console.log(checkedElements);
	var uncheckedElements = filters.find('input[name="'+name+'"]:not(:checked)');
	// console.log(uncheckedElements);
	checkedElements.each(function(index,anElement){
		var value = anElement.value;
		// console.log(value);
		filtersModal.find('input[name="'+name+'"][value="'+value+'"]').prop('checked',true);
	});

	uncheckedElements.each(function(index,anElement){
		var value = anElement.value;
		filtersModal.find('input[name="'+name+'"][value="'+value+'"]').prop('checked', false);
	});
	var checkedModalElements = filtersModal.find('input[name="'+name+'"]:checked');
	console.log(checkedModalElements);
	checkedModalElements.each(function(index,anElement){
		var value = anElement.value;
		console.log(value);
		tagsArray.push(value);
	});

	obj[name] = tagsArray;
	if(obj[name].length == 0) {
		delete obj[name];
	}
	console.log(obj);
	showFilterTags(obj);
});

filters.find('.js-filters').on('change', function(){
	var name = $(this).attr('name');
	var tagsArray = [];
	tagsArray.push($(this).val());
	obj[name] = tagsArray;
//	console.log(obj);
	showFilterTags(obj);
});

var hideFilterTag = function() {
	var name = $(this).attr('data-name');
	var value = $(this).attr('data-value');
	// console.log(value);
	// console.log(obj[name]);
	var index = obj[name].indexOf(value);
	obj[name].splice(index, 1);
	if(obj[name].length == 0) {
		delete obj[name];
	}
	if(isEmpty(obj)) {
		obj = {}
	}
	// console.log(obj);
	showFilterTags(obj);
	filtersModal.find('input[type="checkbox"][name="'+name+'"][value="'+value+'"]').prop('checked', false);
	filters.find('input[type="checkbox"][name="'+name+'"][value="'+value+'"]').prop('checked', false);
	filters.find('.js-filters[name="'+name+'"] option:selected').prop("selected", false);
	filters.find('.js-filters[name="'+name+'"]:checked').prop("checked", false);
	//console.log(element);
	submitFilters();
}

// var openResume = function(event) {
// 	event.preventDefault();
// 	event.stopPropagation();
// 	var resumeOpenVariable = $(this).attr("data-resume-open");
// 	// var url = $(".resume-container[data-resume-open="+resumeOpenVariable+"] .resume-content").attr("data");
// 	// getRequest(url, null, null,null,null,null, function() {
// 	// 	$(".resume-container[data-resume-open="+resumeOpenVariable+"] .resume-content").attr("data", "http//localhost:8000/error.html");
// 	// });
//     $(".resume-container[data-resume-open="+resumeOpenVariable+"]").removeClass("hidden");
//
//
// }



$(".modal-top").on('mouseover','.tags-alphabets a[data-attribute="alphabet-hover"] ', showCheckboxFilter);
$(".modal-top").on('mouseout','.tags-alphabets a[data-attribute="alphabet-hover"] ', hideCheckboxFilter);
$(".modal-top").on('click',".tags-alphabets a[data-attribute='alphabet-hover']", slideToThatFilter);
$('.filter-tags').on('click', '.js-remove-tag', hideFilterTag);
$('.jobs_wrapper').on('click', 'a.icon' , performAction);
$('.jobs_wrapper').on('click', 'a.view-icon' , performViewIcon);
// $('.jobs_wrapper').on('click', '.icon-resume', openResume);
$('.jobs_wrapper').on('click', '.checkbox', function(event) {
	event.stopPropagation();
});

var showFilterTags = function(obj) {

	$('.filter-tags').empty();
	// console.log(obj);
	$.each(obj, function(objKey, array) {
		var filterTagGroup = $('.filter-tag-group.prototype').clone().removeClass('prototype hidden');
		filterTagGroup.html("<span class='text'>"+filterTagGroupNames[objKey]+" :</span>");
		$('.filter-tags').append(filterTagGroup);
		$.each(array, function(arrKey, value) {
			var filterTag = $('.js-show-tags.prototype').clone().removeClass('prototype hidden');
			var valueCheckbox = filtersModal.find('input[type="checkbox"][name="'+objKey+'"][value="'+value+'"]').parent().text();
			var valueSelect = filters.find('.js-filters[name="'+objKey+'"] option:selected').text();
			var valueRadio = filters.find('.js-filters[name="'+objKey+'"]:checked').parent().text();
			var elementValue;
			if(valueCheckbox) {
				elementValue = valueCheckbox;
			}
			else if (valueSelect) {
				elementValue = valueSelect;
			}
			else if (valueRadio) {
				elementValue = valueRadio;
			}
			filterTag.attr("data-name", objKey);
			filterTag.attr("data-value", value);
			filterTag.append(elementValue+"<i class='fa fa-times' aria-hidden='true'></i>");
			filterTag.addClass('inline-block box_shadow js-remove-tag font-sm');
			filterTagGroup.append(filterTag);
		});
	})

	if(!(isEmpty(obj))) {
		$('.filter-tags').append("<button class='button remove-all-filter-tags'>Clear All</button>");
	}

}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

$(".jobs").on('click','.remove-all-filter-tags', function(){
	obj = {};
	$(this).remove();
	showFilterTags(obj);
	filtersModal.find('input[type="checkbox"]').prop('checked', false);
	filters.find('input[type="checkbox"]').prop('checked', false);
	filters.find('.js-filters option:selected').prop("selected", false);
	filters.find('.js-filters:checked').prop("checked", false);
	submitFilters();

})

var searchTags = function(array, metaData, elem) {
	var str = $(elem).val();
	str=str.toLowerCase();
	var dataAttribute = metaData["data-attribute"];
	var resultTags = []
    for (var i=0; i < array.length; i++) {
        if (array[i]["text"] && array[i]["text"].toLowerCase().indexOf(str)>-1) {
            resultTags.push(array[i]);
        }
    }
	$(".row.js-"+dataAttribute+"").empty();
	$(".tags-alphabets-"+dataAttribute+"").empty();
	populateTags(resultTags, metaData);

}

var resultLength;

var populateCalendarOptions = function(res) {
	// console.log(res);
	if(res.status == "success") {
		data = res["data"];
		// console.log(data.length)
		if(data.length != 0) {
			data.forEach(function(anOption) {
				var optionElement = calendarOption.clone().removeClass('prototype hidden');
				optionElement.text(anOption["name"]);
				optionElement.attr("value",anOption["id"]);
				if(anOption["isDefault"]) {
					optionElement.attr("selected", "selected");
					calendarId = optionElement.val();
				}
				if(anOption["isDefault"]==true) {
					$(".set-default-calendar-button").attr("data-default", anOption["defaultID"]);
				}
				$(".calendar-select").append(optionElement);
			})
		}
		else {
			$(".calendar-options-container").addClass("hidden");
			$(".create-new-calendar-container").removeClass("hidden");

		}
	}
}

$(".calendar").on('click','.create-new-calendar',function(){
	window.location = "/recruiter/"+recruiterID+"/slots?createNew=1";
})

viewProfileModal.on('click',".comment-close-message", function(){
	$(this).parent().addClass("hidden");
});

viewProfileModal.on("click", '.submit-comment', function() {
	var obj = {};
	obj["comment"] = $(this).prev().val();
	obj["seekerID"] = $(this).attr("data-job-seeker-id");
	var applicationId = $(this).attr("data-application-id");
	var elem = $(this);
	postRequest(baseUrl+"/recruiter/"+recruiterID+"/job/"+jobId+"/application/"+applicationId+"/comment", null,
	 obj , function(res) {
		 if(res["status"] == "success") {
		 	$(".view-profile-modal .posted-comment").html("successfully posted<i class='comment-close-message fa fa-times' aria-hidden='true'></i>").removeClass("hidden");
			var aCandidate = candidatesMap[applicationId];
			aCandidate["comment"] = obj["comment"];
			console.log(aCandidate);
		}
	});
});

var profileContainer = $(".profile_container");
var tabContainer = $(".tab_container");
var resumeContainer = $(".resume-container");
var candidatesMap = new Object();

var populateJobs = function(res) {

	if(res.status=="success") {
		console.log(res)
		$(".jobs-wrapper-shell-loader").addClass("hidden");
		if(res["data"]["data"]) {
			resultLength = res["data"]["data"].length;
			$(".no-results").addClass("hidden");
		}
		else {

			$(".no-results").removeClass("hidden");
			return;
		}

		var res = res["data"];
		console.log(res);
		jobs.find(".status_all").text(res["total"]);
		jobs.find(".status_shortlisted").text(res["shortlisted"]);
		jobs.find(".status_rejected").text(res["rejected"]);
		jobs.find(".status_saved").text(res["save"]);
		var unread = res["total"] - (res["shortlisted"] + res["rejected"] + res["save"]);
		jobs.find(".status_unread").text(unread);
		jobs.find(".status_sort").text(unread);

		res["data"].forEach(function(aJob){
			candidatesMap[aJob['id']] = aJob;
			var card = tableRow.clone().removeClass('prototype hidden');
			card.attr("data-attribute",'js-'+aJob['id']+'');
			card.find(".interview-invite .send-interview-invite").attr("data-user-id", aJob['userID']);
			card.find(".resend-interview-invite .send-interview-invite").attr("data-user-id", aJob['userID']);
			card.find(".user_name").text(aJob["name"]);
			card.find(".user_experience").text(getJobExperience(aJob["exp_y"], aJob["exp_m"]));
			card.find(".current_location").text(aJob["current_location"]);
			card.find(".applied_date").text(ISODateToD_M_Y(aJob["apply_date"]));
			card.find(".user_sex").text(getTypeGender(aJob["sex"]));
			card.find(".user_age").text(getAge(aJob["dob"]));
			card.find(".user_img").attr('src', aJob["imgUrl"]);
			var iconStatus = aJob["status"];
			var iconElements = card.find(".content_more .icon");
			iconElements.each(function(index,anElement){
				$(anElement).attr("data-application-id", aJob["id"]);
			});
			card.find(".content_more .icon[data-attribute= " + iconStatus + "]").addClass("highlighted");
			card.find(".content_more .view-icon[data-attribute= " + iconStatus + "]").addClass("highlighted");
			card.find(".content_more .view-icon[data-attribute=4]").attr("href","/profile/"+aJob["userID"]+"?jobID="+jobID+"&jobTitle="+jobTitle);
			card.find(".content_more .view-icon[data-attribute=4]").attr("target","_blank");
			card.find(".content_more .download-icon").attr("href",aJob["resumeUrl"]);
			card.find(".content_more .download-icon").attr("target","_blank");
			card.find(".interview-invite.icon").attr("data-interview-invite","js-"+aJob['id']+"");
			card.find(".resend-interview-invite.icon").attr("data-interview-invite","js-"+aJob['id']+"");
			card.find(".interview-invite.icon .slot-type-container").attr("data-interview-invite","js-"+aJob['id']+"");
			card.find(".resend-interview-invite.icon .slot-type-container").attr("data-interview-invite","js-"+aJob['id']+"");
			if(!("invite" in aJob)) {
				card.find(".interview-invite.icon").removeClass("hidden");
			}
			else {
				if(aJob["invite"] == 1) {
					card.find(".resend-interview-invite.icon").removeClass("hidden");
				}
				else if(aJob["invite"] == 2) {
					card.find(".interview-invite-message").text("Interview Set On "+ISODateToD_M_Y(aJob["inviteDate"])+" at "+aJob["inviteTime"]).removeClass("hidden");
				}
			}
			var orgArray = aJob["jobs"];
			var len = orgArray.length;
			var loop = len < 2 ? len:2;
			for(var i=0; i<len; i++) {
				var anOrg ={};
				anOrg = orgArray[i];
				var column = columnOrg.clone().removeClass('prototype hidden');


				column.find(".name").text(anOrg["organization"]);
				column.find(".designation").text(anOrg["designation"]);
				column.find(".extra_info").text(getOrgExp(anOrg["from_exp_month"],anOrg["from_exp_year"],anOrg["to_exp_month"],anOrg["to_exp_year"],anOrg["is_current"]));
				if(i < loop) {
					card.find('.content_organization .organisation-show').append(column);
				}
				// else {
				// 	card.find('.content_organization .organisation-hidden').append(column);
				// }
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
				// if(index > 1) {
				// 	card.find('.content_institute .institute-hidden').append(column);
				// }
				// else {

					card.find('.content_institute .institute-show').append(column);

			})
			// console.log(aJob["tags"]);
			// aJob["tags"].forEach(function(anTag, index){
			// 	if(index > 3) {
			// 		return
			// 	}
			// 	var divEl = $('.tags-jobSeeker.prototype').clone().removeClass('prototype hidden');
			// 	divEl.find(".tags-content").attr("data-tag-name",anTag["name"]);
			// 	divEl.find(".tags-content").attr("data-id",anTag["id"]);
			// 	divEl.find(".tags-content").attr("data-jobseeker-id",aJob['userID']);
			// 	divEl.find(".tags-content").attr("data-jobapplication-id",aJob['id']);
			// 	divEl.find(".tags-content").text(anTag["name"]);
			// 	divEl.find(".tags-content").addClass(' margin-right font-sm');
			// 	divEl.find(".js-remove-tag").attr("data-id",anTag["id"]);
			// 	divEl.find(".js-remove-tag").attr("data-jobseeker-id",aJob['userID']);
			// 	divEl.find(".js-remove-tag").attr("data-jobapplication-id",aJob['id']);
			//
			// 	card.find('.posted-tags').append(divEl);
			// })
			// if(aJob["comment"]) {
			// 	card.find(".comment-container .add-comment").val(aJob["comment"]);
			// 	card.find(".comment-container .submit-comment").text("Update");
			// }
			// else {
			// 	card.find(".comment-container .submit-comment").text("Comment");
			// }
			// card.find(".comment-container .submit-comment").attr("data-job-seeker-id",aJob["userID"])
			// card.find(".comment-container .submit-comment").attr("data-application-id", aJob["id"]);
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

			// card.find(".submit-tag").attr("data-jobseeker-id",aJob["userID"]);
			// card.find(".submit-tag").attr("data-jobapplication-id",aJob["id"]);
			//
			// card.find(".extra-info-container .maritalStatus").text(boolean(aJob["marital_status"]));
			// //card.find("extra-info-container .languages").text(formatLanguages(aJob["language_known"]));
			// card.find(".extra-info-container .permit").text(boolean(aJob["work_permit"]));
			// card.find(".extra-info-container .handleTeam").text(boolean(aJob["handle_team"]));
			// card.find(".extra-info-container .sixDayWorking").text(aJob[""]);
			// card.find(".extra-info-container .relocate").text(boolean(aJob["relocate"]));
			// card.find(".extra-info-container .differentlyAbled").text(boolean(aJob["differently_abled"]));
			// card.find(".extra-info-container .earlyStartup").text(boolean(aJob["early_startup"]));
			// card.find(".extra-info-container .travel").text(boolean(aJob["willing_travel"]));

				// card.find(".view-profile-modal").attr("data-application-id", 'js-'+aJob['id']);
				// card.find(".close-overlay-profile-modal").attr("data-application-id", 'js-'+aJob['id']);
				// console.log(aJob["name"]);
				//
				// if(aJob["email"]) {
				// 	card.find(".userDetail .email").html(aJob["email"]+"<span class='important-info-color'> (Verified)</span>").removeClass("animated-background");
				// }
				// else {
				// 	card.find(".userDetail .email").addClass("hidden");
				// }
				// if(aJob["phone"]) {
				// 	card.find(".userDetail .contact").html(aJob["phone"]+"<span class='important-info-color'> (Verified)</span>");
				// }
				// else {
				// 	card.find(".userDetail .contact").addClass("hidden");
				// }
				// card.find(".userDetail .name").text(aJob["name"]);
				// card.find(".extraInfo .experience").text("Experience: "+aJob["exp_y"]+"y "+aJob["exp_m"]+"m");
				// card.find(".extraInfo .location").text("Location: "+aJob["current_location"]);
				// if(aJob["notice"] > 6) {
				// 	card.find(".userDetail .notice").text("Notice: Immediately Available");
				// }
				// else {
				// 	card.find(".userDetail .notice").text("Notice: "+aJob["notice"]+ " months");
				// }
				// card.find(".userDetail .user_img").attr("src", aJob["imgUrl"]);
				// card.find(".userDetail .sex").text(getTypeGender(aJob["sex"]));
				// card.find(".userDetail .age").text(getAge(aJob["dob"]) + " years");
				// card.find(".userDetail .last-login").text("Last Login: "+ISODateToD_M_Y(aJob["last_active_date"]));
				// card.find(".userDetail .applyDate").text("Applied: "+ISODateToD_M_Y(aJob["apply_date"]));
				// // card.find(".shell-loader-container").addClass("hidden");
				// //profileContainer.find(".userDetail .applyDate").text(data["apply_date"]);
				// if(aJob["pref_location"]) {
				// 	card.find(".extraInfo .prefLocation").text("Preferred Location: "+aJob["pref_location"]);
				// }
				// else {
				// 	card.find(".extraInfo .prefLocation").text("Preferred Location: Not Specified");
				// }
				//
				// var curSalary = (aJob["current_ctc"])? aJob["current_ctc"]+" Lakhs": "confidential";
				// card.find(".extraInfo .currentCTC").text("Current Salary: "+ curSalary);
				// var expSalary = (aJob["expected_ctc"])? aJob["expected_ctc"]+" Lakhs": "confidential";
				// card.find(".extraInfo .expectedCTC").text("Expected Salary: "+ expSalary);
				//
				// card.find(".moreInfo .maritalStatus").text(boolean(aJob["marital_status"]));
				// if(aJob["language_known"]!= "") {
				// 	card.find(".moreInfo .languages").text(formatLanguages(aJob["language_known"]));
				// }
				// else {
				// 	card.find(".moreInfo .languages").text("nil");
				// }
				// card.find(".moreInfo .permit").text(boolean(aJob["work_permit"]));
				// card.find(".moreInfo .handleTeam").text(boolean(aJob["handle_team"]));
				// //profileContainer.find(".moreInfo .sixDayWorking").text(data[""]);
				// card.find(".moreInfo .relocate").text(boolean(aJob["relocate"]));
				// card.find(".moreInfo .differentlyAbled").text(boolean(aJob["differently_abled"]));
				// card.find(".moreInfo .earlyStartup").text(boolean(aJob["early_startup"]));
				// card.find(".moreInfo .travel").text(boolean(aJob["willing_travel"]));
				// if(aJob["about"]!= "") {
				// 	card.find(".moreInfo .about").text(boolean(aJob["about"]));
				// }
				// else {
				// 	card.find(".moreInfo .about").addClass("hidden");
				// }
				//
				// var status = aJob["status"];
				// console.log(status);
				// 	card.find(".buttons .ico[data-attribute="+ status +"]").addClass("highlighted");
				// card.find(".buttons .icon-status").attr("data-application-id",aJob["id"]);
				//
				// aJob["jobs"].forEach(function(aJob, index){
				//
				// 	var cardtemp = $(".jobCard.prototype").clone().removeClass('prototype hidden');
				// 	cardtemp.find(".name").text(aJob["organization"])
				// 	cardtemp.find(".designation").text(aJob["designation"]);
				// 	cardtemp.find(".extra_info").text(getOrgExp(aJob["from_exp_month"],aJob["from_exp_year"],aJob["to_exp_month"],aJob["to_exp_year"],aJob["is_current"]));
				// 	card.find(".profile_content .organization").append(cardtemp);
				// })
				//
				// aJob["edu"].forEach(function(anEdu,index){
				//
				// 	var column = $(".instituteCard.prototype").clone().removeClass('prototype hidden');
				//
				// 	column.find(".name").text(anEdu["institute"]);
				// 	column.find(".start_duration").text(anEdu["batch_from"]);
				// 	column.find(".end_duration").text(anEdu["batch_to"]);
				// 	column.find(".degree").text(anEdu["degree"]);
				// 	card.find('.profile_content .institute').append(column);
				// })
				//
				// aJob["tags"].forEach(function(anTag, index){
				//
				// 	var divEl = $('.tags-jobSeeker.prototype').clone().removeClass('prototype hidden');
				// 	divEl.find(".tags-content").attr("data-tag-name",anTag["name"]);
				// 	divEl.find(".tags-content").attr("data-id",anTag["id"]);
				// 	divEl.find(".tags-content").attr("data-jobseeker-id",aJob['userID']);
				// 	divEl.find(".tags-content").attr("data-jobapplication-id",aJob['id']);
				// 	divEl.find(".tags-content").text(anTag["name"]);
				// 	divEl.find(".tags-content").addClass(' margin-right font-sm');
				// 	divEl.find(".js-remove-tag").attr("data-id",anTag["id"]);
				// 	divEl.find(".js-remove-tag").attr("data-jobseeker-id",aJob['userID']);
				// 	divEl.find(".js-remove-tag").attr("data-jobapplication-id",aJob['id']);
				//
				// 	card.find('.content.more .posted-tags').append(divEl);
				// })
				// card.find(".submit-comment").attr("data-job-seeker-id",aJob["userID"]);
				// card.find(".submit-comment").attr("data-application-id",aJob["id"]);
				// card.find(".submit-tag").attr("data-jobseeker-id",aJob["userID"]);
				// card.find(".submit-tag").attr("data-jobapplication-id",aJob["id"]);
				// if(aJob["comment"]) {
				// 	card.find(".add-comment").val(aJob["comment"]);
				// 	card.find(".submit-comment").text("Update");
				// }
				// else {
				// 	card.find(".submit-comment").text("Comment");
				// }
				// 	card.find(".contact-info .email").text(aJob["email"]);
				// if(aJob["phone"]) {
				// 	card.find(".contact-info .contact").text(aJob["phone"]);
				// }
				// else {
				// 	card.find(".info.phone").addClass("hidden");
				// }
				//
				// // PDFJS.getDocument("https://cdn.mozilla.net/pdfjs/helloworld.pdf").then(function(pdf) {
				// //   console.log(pdf.numPage);
				// // });
				//
				// // getBinaryData("https://cdn.mozilla.net/pdfjs/helloworld.pdf");
				// card.find(".resume-embed-container").html('<embed src="'+aJob["resumeUrl"]+'" class="resume-embed" type="application/pdf">')
				//
				// if(aJob["cover_text"]) {
				// 	var coverText = aJob["cover_text"];
				// 	card.find(".cover_content").text(coverText);
				// }
				// else{
				// 	card.find(".cover_letter	").addClass("hidden");
				// 	card.find(".resume").css("width","100%");
				// }

			$('.jobs_container .jobs_wrapper').append(card);

		})
	}
}

// function callGetDocment (response) {
//   console.log(response)
//
//   PDFJS.getDocument(response).then(function getPdfHelloWorld(_pdfDoc) {
// 	  console.log(_pdfDoc.pdfInf)
//     pdfDoc = _pdfDoc;
//     // renderPage(pageNum);
//   });
// }
//
// function getBinaryData (url) {
//     // body...
//     var xhr = new XMLHttpRequest();
//
//     xhr.open('GET', url, true);
//     xhr.responseType = 'arraybuffer';
//     xhr.onload = function(e) {
//         //binary form of ajax response,
//         callGetDocment(e.currentTarget.response);
//     };
//
//     xhr.onerror = function  () {
//         // body...
//         alert("xhr error");
//     }
//
//     xhr.send();
// }

function boolean(data) {
	if(data === 1) {
		return "yes"
	}
	else if (data === 0) {
		return "no"
	}
}

function formatLanguages(data){
	var ob = JSON.parse(data);
	var langArray = [];
	for(var key in ob){
		langArray.push(ob[key]["language_text"]);
	}
	return langArray.join(", ");
}

function getJobExperience(expInYrs, expInMnth) {
  var total_exp = expInYrs + "y " +expInMnth + "m";
  return total_exp ;
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

function getMonthName(month) {
	var monthNames = ["Jan", "Feb", "March", "April", "May", "June",
                        "July", "Aug", "Sep", "Oct", "Nov", "Dec"
                    ];
	return monthNames[month];
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


// var showLoader = function() {
// 	$('.shell-loaders').removeClass('hidden')
// }
//
// var hideLoader = function() {
// 	$('.shell-loaders').addClass('hidden');
// }
var showLoaderScroll = function() {
	$('.loader-scroll').removeClass('hidden')
}

var hideLoaderScroll = function() {
	$('.loader-scroll').addClass('hidden');
}

var ticker;
function checkScrollEnd() {

	if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
		var attribute = $('.stat.highlight')[0];
		var id = $(attribute).attr("data-attribute");
		var queryString = createObject();
		queryString = checkTabId(id, queryString);
		queryString["pageContent"] = pageContent;
		pageNumber = pageNumber + 1;
		queryString["pageNumber"] = pageNumber;
		// console.log(queryString);
		if(queryString["pageNumber"] != 1 && resultLength == queryString["pageContent"] ) {
			getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+jobId, queryString, populateJobs, showLoaderScroll, hideLoaderScroll)
		}
	}
}

$(window).scroll(function() {
 clearTimeout(ticker);

 ticker = setTimeout(checkScrollEnd,100);

});

function fetchURL(){
       var obj = {}
       for(var key in window["location"]){
               if(typeof(window["location"][key])=="string"){
                       obj[key]= window["location"][key];
               }
       }
       return obj;
}

function fetchQueryVariable(stringToFind) {
       var obj = fetchURL();
       if(obj["search"]){
               var testString = obj["search"];
               testString= testString.replace("?", "");
               testString= testString.split("&");
               for(var i=0; i < testString.length; i++){
                       var temp=testString[i].split("=");
                       if(temp[0]==stringToFind) {
                               return temp[1];
                       }
               }
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

// $(".resume-content")[0].addEventListener('error', function(e) {
//    // console.log(e);
// }, true);

function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}
