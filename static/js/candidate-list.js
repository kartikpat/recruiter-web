var modal = $(".modal");
var openModalBtn = $(".js-open-modal");
var closeModalBtn = $(".js-close-modal");
var filters = $(".filters");

/**
 * opens the respective modal depending upon the data-attribute passed through the clicked element
 * @return null
 */
var openModal = function() {
	var id = $(this).attr('data-attribute');
	var modal = $('.modal[data-attribute= ' + id + ']');
	var tags = filters.find('.js-tags[data-attribute= ' + id + ']');
	tags.find("input[type='checkbox']:checked").each(function() {
		var value= $(this).val();
	  	$(".js-tags-modal[data-attribute=" + id + "] input[type='checkbox'][value=  " + value +"]").prop('checked',true);
	});
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

var loadViewByData = function() {
	var id = $(this).attr('data-attribute');
	var queryString = {};
	pageNumber = 1;
	if(id=='magicsort'){
	  queryString["sortBy"] = 1;
	}
	else if(id==-1 || (id>0 && id <4)){
	  queryString["status"] = id;
	}
	queryString["pageContent"] = pageContent;
	queryString["pageNumber"] = pageNumber;
	viewByOptions.removeClass("highlight");
	$(this).addClass("highlight");
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+334895, queryString, populateJobs)
	$('.jobs_wrapper').empty();
}


var submitFilters = function() {
	var parameters = {
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
		language: obj["language"]
	};
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+334895, parameters, populateJobs);
	$('.jobs_wrapper').empty();
}

// When the user clicks anywhere outside of the modal, close it
 /*window.onclick = function(event) {
	if (event.target == modal[0]) {
		modal[0].style.display = "none";
  //      tags.style.display = "block";
	}
}*/

var baseUrl = "http://13.126.92.102:8000"
var recruiterID = 45058;
var jobs = $(".jobs");
var tableRow = $(".jobs_content.prototype");
var columnOrg =  $(".organization.prototype");
var columnIns =  $(".institute.prototype");
var viewByOptions = $(".jobs .menu .stat");
var pageNumber = 1;
var pageContent = 5;

$(document).ready(function(){
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+334895, {
	  pageContent: 5,
	  pageNumber: pageNumber
	   }, populateJobs)

	openModalBtn.click(openModal);
	closeModalBtn.click(closeModal);
	viewByOptions.click(loadViewByData);
	$(".submit-filters").click(submitFilters);
});

var populateJobs = function(res){
	if(res.status=="success"){
		var res = res["data"];
		jobs.find(".status_all").text(res["total"]);
		jobs.find(".status_shortlisted").text(res["shortlisted"]);
		jobs.find(".status_rejected").text(res["rejected"]);
		jobs.find(".status_saved").text(res["save"]);
		var unread = res["total"] - (res["shortlisted"] + res["rejected"] + res["save"]);
		jobs.find(".status_unread").text(unread);
		jobs.find(".status_sort").text(unread);

		res["data"].forEach(function(aJob){
			//console.log(total_exp);
			var card = tableRow.clone().removeClass('prototype hidden');
			card.find(".user_name").text(aJob["name"]);
			card.attr("href","/profile/"+aJob["userID"]+"?jobID="+jobID)
			card.find(".user_experience").text(getJobExperience(aJob["exp_y"], aJob["exp_m"]));
			card.find(".current_location").text(aJob["current_location"]);
			card.find(".applied_date").text(ISODateToD_M_Y(aJob["apply_date"]));
			card.find(".user_sex").text(aJob["sex"]);
			card.find(".user_age").text(getAge(aJob["dob"]));
			card.find(".user_img").attr('src', aJob["imgUrl"]);
			var iconStatus = aJob["status"];
			card.find(".icon[data-attribute= " + iconStatus + "]").addClass("highlighted");
			card.find(".icon[data-attribute=4]").attr("href","/profile/"+aJob["userID"]+"?jobID="+jobID);
			var orgArray = aJob["jobs"];
			var i;
			var len = orgArray.length;
			var loop = len < 3 ? len:3;
			for(i=0; i<loop; i++) {
				var anOrg ={};
				anOrg = orgArray[i];
				var column = columnOrg.clone().removeClass('prototype hidden');
				column.find(".name").text(anOrg["organization"]);
				column.find(".designation").text(anOrg["designation"]);
				column.find(".extra_info").text(getOrgExp(anOrg["from_exp_month"],anOrg["from_exp_year"],anOrg["to_exp_month"],anOrg["to_exp_year"],anOrg["is_current"]));
				card.find('.content_organization').append(column);
			}
			aJob["edu"].forEach(function(anEdu){
				var column = columnIns.clone().removeClass('prototype hidden');

				column.find(".name").text(anEdu["institute"]);
				column.find(".start_duration").text(anEdu["batch_from"]);
				column.find(".end_duration").text(anEdu["batch_to"]);
				column.find(".degree").text(anEdu["degree"]);
				card.find('.content_institute').append(column);
			})
			$('.jobs_container .jobs_wrapper').append(card);
		})
	}
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



var obj = {};

filters.find('input[type="checkbox"]').on('change', function(){
	var name = $(this).attr('name');
	var tagsArray = [];
	var elements = filters.find('input[name="'+name+'"]:checked');
	elements.each(function(index,anElement){
		tagsArray.push(anElement.value);
	});
	obj[name] = tagsArray;
});

filters.find('#min-experience').on('change', function() {
	var minExperienceTag = this.value;
	obj["minExperience"] = minExperienceTag;


});

filters.find('#max-experience').on('change', function() {
	var maxExperienceTag = this.value;
	obj["maxExperience"] = maxExperienceTag;


});

filters.find('#min-batch').on('change', function() {
	var minBatchTag = this.value;
	obj["minBatch"] = minBatchTag;


});

filters.find('#max-batch').on('change', function() {
	var maxBatchTag = this.value;
	obj["maxBatch"] = maxBatchTag;


});

filters.find('#min-salary').on('change', function() {
	var minSalaryTag = this.value;
	obj["minSalary"] = minSalaryTag;


});

filters.find('#max-salary').on('change', function() {
	var maxSalaryTag = this.value;
	obj["maxSalary"] = maxSalaryTag;


});

filters.find('#min-age').on('change', function() {
	var minAgeTag = this.value;
	obj["minAge"] = minAgeTag;


});

filters.find('#max-age').on('change', function() {
	var maxAgeTag = this.value;
	obj["maxAge"] = maxAgeTag;


});

filters.find("input[name='gender']").on('change', function() {
	var gender = this.value;
	obj["gender"] = gender;


});

filters.find('#notice-period').on('change', function() {
	var noticePeriodTag = this.value;
	obj["noticePeriod"] = noticePeriodTag;


});

filters.find('#applied-date').on('change', function() {
	var appliedDateTag = this.value;
	obj["appliedDate"] = appliedDateTag;


});

filters.find('#last-seen').on('change', function() {
	var lastSeenTag = this.value;
	obj["lastSeen"] = lastSeenTag;


});

filters.find("input[name='work-permit']").on('change', function() {
	var isWorkPermitTag = this.value;
	obj["isWorkPermit"] = isWorkPermitTag;


});

filters.find("input[name='team-handle']").on('change', function() {
	var hasHandledTeamTag = this.value;
	obj["hasHandledTeam"] = hasHandledTeamTag;


});

filters.find("input[name='relocate']").on('change', function() {
	var canRelocateTag = this.value;
	obj["canRelocate"] = canRelocateTag;


});

filters.find("input[name='abled']").on('change', function() {
	var isDifferentlyAbledTag = this.value;
	obj["isDifferentlyAbled"] = isDifferentlyAbledTag;


});

var ticker;

function checkScrollEnd() {

	if($(window).scrollTop() + $(window).height() > $(document).height() - 200) {
		var attribute = $('.stat.highlight')[0];
		var id = $(attribute).attr("data-attribute");
		var queryString = {};
		if(id=='magicsort'){
		  queryString["sortBy"] = 1;
		}
		else if(id==-1 || (id>0 && id <4)){
		  queryString["status"] = id;
		}
		queryString["pageContent"] = 5;
		pageNumber = pageNumber + 1;
		queryString["pageNumber"] = pageNumber;
		if(queryString["pageNumber"] != 1) {
			getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+334895, queryString, populateJobs)
		}
	}
}

$(window).scroll(function() {
 clearTimeout(ticker);

 ticker = setTimeout(checkScrollEnd,100);

});
