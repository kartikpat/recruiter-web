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

$(window).click(function() {
	$(".resume-container").addClass("hidden");
});

window.addEventListener('error', function(e) {
   console.log(e);
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
var pageContent = 5;

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
	if(dataAttribute == 4) {
		var redirectionLocation = $(this).attr("href");
		window.location = redirectionLocation;
	}
}



jobContainer.on('click','.jobs_content .send-interview-invite', function(event){
	event.preventDefault();
	event.stopPropagation();
	var slotType = $(this).attr("data-attribute");
	var seekerId = $(this).attr("data-user-id");
	postRequest(baseUrl+"/recruiter/"+recruiterID+"/calendar/"+calendarId+"/invite/"+jobId, null ,{
		seekerID: seekerId,
		slotType: slotType
	}, successCallback);
})

jobContainer.on('mouseover','.jobs_content .interview-invite.icon', function(event){
	var dataInterviewInvite = $(this).attr("data-interview-invite");
	jobContainer.find('.slot-type-container[data-interview-invite='+dataInterviewInvite+']').removeClass("hidden");
})

jobContainer.on('mouseout','.jobs_content .interview-invite.icon', function(){
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
		$(".heading").text("Job : "+jobId+" , "+jobTitle+"");
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

	$(".jobs_wrapper").on('click','.content-container', function() {
		var dataAttribute = $(this).parent().attr('data-attribute');
		$(".jobs_content[data-attribute="+dataAttribute+"] .slide-container").toggleClass('hidden');
		$(".jobs_content[data-attribute="+dataAttribute+"] .divider.prototype").toggleClass('hidden');
		$(".jobs_content[data-attribute="+dataAttribute+"]").toggleClass('overlay-show');
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
	}
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/calendar/"+jobId, {} , populateCalendarOptions );
	//
	//console.log(calendarId);
	$(".set-default-calendar-button").click(setDefaultCalendar)

	$("#search-by-keyword-button").click(searchByKeyword);



});

$(".jobs_wrapper").on("keyup", '.add-tag', function() {
	var string = $(this).val();
	console.log(string);
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

$(".jobs_wrapper").on("click", '.tags-jobSeeker .tags-content', function() {
	var dataId = $(this).attr("data-id");
	var dataName = $(this).attr("data-tag-name");
	window.location = "/recruiter/filter-candidate?tagID="+dataId+"&tagName="+dataName;
})

$(".jobs_wrapper").on("click", '.submit-tag', function() {
	var obj = {};
	obj["name"] = $(this).prev().val();
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

$(".jobs_wrapper").on("click", '.posted-tags .tags-content', function() {

});

$(".jobs_wrapper").on("click", '.js-remove-tag.job-seeker-tags', function() {
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



var populateTags = function(res) {
	console.log(res);
}

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
    console.log(res);
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
	//console.log(obj);
	showFilterTags(obj);
});

filters.on('change','input[type="checkbox"]', function(){
	var name = $(this).attr('name');
	var tagsArray = [];
	var checkedElements = filters.find('input[name="'+name+'"]:checked');
	var uncheckedElements = filters.find('input[name="'+name+'"]:not(:checked)');
	checkedElements.each(function(index,anElement){
		var value = anElement.value;
		filtersModal.find('input[name="'+name+'"][value="'+value+'"]').prop('checked',true);
		tagsArray.push(value);
	});
	uncheckedElements.each(function(index,anElement){
		var value = anElement.value;
		filtersModal.find('input[name="'+name+'"][value="'+value+'"]').prop('checked', false);
	});
	obj[name] = tagsArray;
	//console.log(obj);
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
//	console.log(value);
//	console.log(obj[name]);
	var index = obj[name].indexOf(value);
	obj[name].splice(index, 1);
//	console.log(obj);
	showFilterTags(obj);
	filtersModal.find('input[type="checkbox"][name="'+name+'"][value="'+value+'"]').prop('checked', false);
	filters.find('input[type="checkbox"][name="'+name+'"][value="'+value+'"]').prop('checked', false);
	filters.find('.js-filters[name="'+name+'"] option:selected').prop("selected", false);
	filters.find('.js-filters[name="'+name+'"]:checked').prop("checked", false);
	//console.log(element);
	submitFilters();
}

var openResume = function(event) {
	event.preventDefault();
	event.stopPropagation();
	var resumeOpenVariable = $(this).attr("data-resume-open");
	// var url = $(".resume-container[data-resume-open="+resumeOpenVariable+"] .resume-content").attr("data");
	// getRequest(url, null, null,null,null,null, function() {
	// 	$(".resume-container[data-resume-open="+resumeOpenVariable+"] .resume-content").attr("data", "http//localhost:8000/error.html");
	// });
    $(".resume-container[data-resume-open="+resumeOpenVariable+"]").removeClass("hidden");


}



$(".modal-top").on('mouseover','.tags-alphabets a[data-attribute="alphabet-hover"] ', showCheckboxFilter);
$(".modal-top").on('mouseout','.tags-alphabets a[data-attribute="alphabet-hover"] ', hideCheckboxFilter);
$(".modal-top").on('click',".tags-alphabets a[data-attribute='alphabet-hover']", slideToThatFilter);
$('.filter-tags').on('click', '.js-remove-tag', hideFilterTag);
$('.jobs_wrapper').on('click', 'a.icon' , performAction);
$('.jobs_wrapper').on('click', '.icon-resume', openResume);
$('.jobs_wrapper').on('click', '.checkbox', function(event) {
	event.stopPropagation();
});

var showFilterTags = function(obj) {

	$('.filter-tags').empty();
	$.each(obj, function(objKey, array) {
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
			$('.filter-tags').append(filterTag);
		});
	})
}

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
	if(res.status == "success") {
		data = res["data"];
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
}

var populateJobs = function(res){

	if(res.status=="success"){
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
		jobs.find(".status_all").text(res["total"]);
		jobs.find(".status_shortlisted").text(res["shortlisted"]);
		jobs.find(".status_rejected").text(res["rejected"]);
		jobs.find(".status_saved").text(res["save"]);
		var unread = res["total"] - (res["shortlisted"] + res["rejected"] + res["save"]);
		jobs.find(".status_unread").text(unread);
		jobs.find(".status_sort").text(unread);

		res["data"].forEach(function(aJob){
			var card = tableRow.clone().removeClass('prototype hidden');
			card.attr("data-attribute",'js-'+aJob['id']+'');
			card.find(".send-interview-invite").attr("data-user-id", aJob['userID']);
			card.find(".user_name").text(aJob["name"]);
			card.find(".user_experience").text(getJobExperience(aJob["exp_y"], aJob["exp_m"]));
			card.find(".current_location").text(aJob["current_location"]);
			card.find(".applied_date").text(ISODateToD_M_Y(aJob["apply_date"]));
			card.find(".user_sex").text(aJob["sex"]);
			card.find(".user_age").text(getAge(aJob["dob"]));
			card.find(".user_img").attr('src', aJob["imgUrl"]);
			var iconStatus = aJob["status"];
			var iconElements = card.find(".content_more .icon");
			iconElements.each(function(index,anElement){
				$(anElement).attr("data-application-id", aJob["id"]);
			});
			card.find(".content_more .icon[data-attribute= " + iconStatus + "]").addClass("highlighted");
			card.find(".content_more .icon[data-attribute=4]").attr("href","/profile/"+aJob["userID"]+"?jobID="+jobID+"&jobTitle="+jobTitle);
			card.find(".interview-invite.icon").attr("data-interview-invite","js-"+aJob['id']+"");
			card.find(".slot-type-container").attr("data-interview-invite","js-"+aJob['id']+"");
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
			console.log(aJob["tags"]);
			aJob["tags"].forEach(function(anTag, index){
				if(index > 3) {
					return
				}
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

				card.find('.posted-tags').append(divEl);
			})
			card.find(".icon-resume").attr("data-resume-open",'js-open-'+aJob['id']+'');
			card.find(".resume-container").attr("data-resume-open",'js-open-'+aJob['id']+'');
			card.find(".resume-container .resume-content").attr("data",aJob["resumeUrl"]);
			var tagLine = aJob["about"];
			if(tagLine) {
				card.find(".tagline-content").text(tagLine);
			}
			else {
				card.find(".tagline-container").addClass("hidden");
				card.find(".tagline-divider").addClass("hidden");
			}
			card.find(".email-content").text(aJob["email"]);
			var contactNo = aJob["phone"];
			if(contactNo) {
				card.find(".contact-content").text(contactNo);
			}
			else {
			//	card.find(".contact").addClass("hidden");
			}

			card.find(".submit-tag").attr("data-jobseeker-id",aJob["userID"]);
			card.find(".submit-tag").attr("data-jobapplication-id",aJob["id"]);

			card.find(".extra-info-container .maritalStatus").text(boolean(aJob["marital_status"]));
			//card.find("extra-info-container .languages").text(formatLanguages(aJob["language_known"]));
			card.find(".extra-info-container .permit").text(boolean(aJob["work_permit"]));
			card.find(".extra-info-container .handleTeam").text(boolean(aJob["handle_team"]));
			card.find(".extra-info-container .sixDayWorking").text(aJob[""]);
			card.find(".extra-info-container .relocate").text(boolean(aJob["relocate"]));
			card.find(".extra-info-container .differentlyAbled").text(boolean(aJob["differently_abled"]));
			card.find(".extra-info-container .earlyStartup").text(boolean(aJob["early_startup"]));
			card.find(".extra-info-container .travel").text(boolean(aJob["willing_travel"]));
			$('.jobs_container .jobs_wrapper').append(card);

		})
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
		console.log(queryString);
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

$(".resume-content")[0].addEventListener('error', function(e) {
   console.log(e);
}, true);
