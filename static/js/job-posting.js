"use strict";

var modal = $(".modal");
var openModalBtn = $(".js-open-modal");
var closeModal = $(".js-close-modal");
var filters = $(".filters");

openModalBtn.click(function() {

    var id = $(this).attr('data-attribute');

    var modal = $('.modal[data-attribute= ' + id + ']');

    var tags = filters.find('.js-tags[data-attribute= ' + id + ']');

    tags.find("input[type='checkbox']:checked").each(function() {
  		    var valu= $(this).val();
            $(".js-tags-modal[data-attribute=" + id + "] input[type='checkbox'][value=  " + valu +"]").prop('checked',true);
  			});

    modal[0].style.display = "block";

})

closeModal.click(function() {
  var id = $(this).attr('data-attribute');
  var modal = $('.modal[data-attribute= ' + id + ']');
    modal[0].style.display = "none";

})

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
var st = $(".jobs .menu");
var pageNumber = 1;

$(document).ready(function(){

   getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+334895, {
      pageContent: 5,
      pageNumber: pageNumber
       }, populateJobs)

})

  st.find(".stat").click(function() {
    var id = $(this).attr('data-attribute');
    pageNumber = 1
    var queryString = {};
    if(id=='magicsort'){
      queryString["sortBy"] = 1;
    }
    else if(id==-1 || (id>0 && id <4)){
      queryString["status"] = id;
    }
    queryString["pageContent"] = 5;
    queryString["pageNumber"] = 1;
    st.find(".stat").removeClass("highlight");
    $(this).addClass("highlight");
    getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+334895, queryString, populateJobs)
    $('.jobs_wrapper').empty();

  });





var populateJobs = function(res){
//  console.log(res["data"]["data"]);
	if(res.status=="success"){
    var res = res["data"];
    jobs.find(".status_all").text(res["total"]);
    jobs.find(".status_shortlisted").text(res["shortlisted"]);
    jobs.find(".status_rejected").text(res["rejected"]);
    jobs.find(".status_saved").text(res["save"]);

		res["data"].forEach(function(aJob){
			//console.log(total_exp);
      var card = tableRow.clone().removeClass('prototype hidden');

	     card.find(".user_name").text(aJob["name"]);
      card.find(".user_experience").text(getJobExperience(aJob["exp_y"], aJob["exp_m"]));
      card.find(".current_location").text(aJob["current_location"]);
      card.find(".applied_date").text(ISODateToD_M_Y(aJob["apply_date"]));
      card.find(".user_sex").text(aJob["sex"]);
      card.find(".user_age").text(getAge(aJob["dob"]));
      card.find(".user_img").attr('src', aJob["imgUrl"]);
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

filters.find('input[type="checkbox"][name="industry[]"]').on('change', function() {
    var industryTags = filters.find('input[name="industry[]"]:checked').map(function() {
        return this.value;
    })
    .get();

    obj["industry"] = industryTags.join(',');


});

filters.find('input[type="checkbox"][name="functional-area[]"]').on('change', function() {
    var functionalAreaTags = filters.find('input[name="functional-area[]"]:checked').map(function() {
        return this.value;
    })
    .get();

    obj["functionalArea"] = functionalAreaTags.join(',');


});

filters.find('input[type="checkbox"][name="cur-loc[]"]').on('change', function() {
    var currentLocationTags = filters.find('input[name="cur-loc[]"]:checked').map(function() {
        return this.value;
    })
    .get();

    obj["currentLocation"] = currentLocationTags.join(',');


});

filters.find('input[type="checkbox"][name="institute[]"]').on('change', function() {
    var instituteTags = filters.find('input[name="institute[]"]:checked').map(function() {
        return this.value;
    })
    .get();

    obj["institute"] = instituteTags.join(',');


});

filters.find('input[type="checkbox"][name="pref-loc[]"]').on('change', function() {
    var preferredLocationTags = filters.find('input[name="pref-loc[]"]:checked').map(function() {
        return this.value;
    })
    .get();

    obj["preferredLocation"] = preferredLocationTags.join(',');


});

filters.find('input[type="checkbox"][name="languages[]"]').on('change', function() {
    var languageTags = filters.find('input[name="languages[]"]:checked').map(function() {
        return this.value;
    })
    .get();

    obj["language"] = languageTags.join(',');


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


filters.find(".submit-filters").click(function() {

    getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+334895, {
        industry: obj["industry"],
        location: obj["currentLocation"],
        prefLocation: obj["preferredLocation"],
        insti: obj["institute"],
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


    }, populateJobs);
    $('.jobs_wrapper').empty();
})

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
