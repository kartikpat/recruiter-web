"use strict";
// Get the modal

var modal = $(".modal");
// Get the button that opens the modal
var btn = $(".link.open_modal");
//var tags = document.getElementById("tags");
// Get the <span> element that closes the modal
var span = $(".close.close_modal");

var filters = $(".filters");



// When the user clicks on the button, open the modal
btn.click(function() {

    var id = $(this).attr('data-attribute');

    var modal = $('.modal[data-attribute= ' + id + ']');

    filters.find('.tags[data-attribute= ' + id + ']'[0]).appendTo(modal.find(".column.left")[0]).removeClass("tags");

    modal[0].style.display = "block";


    //tags.style.display = "none";
})

// When the user clicks on <span> (x), close the modal
span.click(function() {
  var id = $(this).attr('data-attribute');
  var modal = $('.modal[data-attribute= ' + id + ']');
    modal[0].style.display = "none";
//    tags.style.display = "block";
})

// When the user clicks anywhere outside of the modal, close it
 window.onclick = function(event) {
    if (event.target == modal[0]) {
        modal[0].style.display = "none";
  //      tags.style.display = "block";
    }
}

var baseUrl = "http://13.126.92.102:8000"
var recruiterID = 45058;
var jobs = $(".jobs");
var tableRow = $(".jobs_content.prototype");
var columnOrg =  $(".organization.prototype");
var columnIns =  $(".institute.prototype");
var st = $(".jobs .menu");

$(document).ready(function(){

   getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+334895, {
      pageContent: 5,
      pageNumber: 1
       }, populateJobs)




})

  st.find(".stat").click(function() {
    var id = $(this).attr('data-attribute');
    var queryString = {};
    if(id=='magicsort'){
      queryString["sortBy"] = 1;
    }
    else if(id==-1 || (id>0 && id <4)){
      queryString["status"] = id;
    }
    //queryString["pageContent"] = 5;
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

filters.find(".submit_filters").click(function() {
  var arr = [];
  filters.find("input[name='industry[]']:checked").each(function() {
		    arr.push(filters.find(this).val());
        console.log(arr.join(','));
			});
})
