var recruiterID = localStorage.id;
var baseUrl = "http://13.126.92.102:8000"

var profile = $(".user_profile");
var tableRow = $(".jobs_content.prototype");


var modal = $('.modal');
var openGuidelines = $("#posting-guidelines");
var closeModalBtn = $(".close");



$(document).ready(function(){
	getRequest(baseUrl+"/recruiter/"+recruiterID, {}, populateProfile);
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs", {}, populateJobs);
	openGuidelines.click(openGuidelinesModal);

	closeModalBtn.click(closeModal);
	$(".close-modal").click(closeModal);
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.addClass('hidden');
        }
    }
	$("#edit-profile").click(function() {
		window.location = "/recruiter/edit-profile";
	})
	$("#edit-pencil").click(function() {
		window.location = "/recruiter/edit-profile";
	})
	// $(".profile_link").click(function(event) {
	// 	event.preventDefault();
	// 	window.location = "http://www.iimjobs.com/r/"+recruiterID+"-shreya-jain";
	// })
	//$(".social-buttons-connected").on('click','.connected-to-social',openSocialProfile);
	//
	// if('serviceWorker' in navigator) {
	//   //browser supports now register it
	//   navigator.serviceWorker
	// 		 .register('service-worker.js') //Note that we have not passed scope object here now by default it will pick root scope
	// 		 .then(function() {
	// 			  console.log('Service Worker Registered');
	// 		  })
	// 		  .catch(function(err) {
	// 			  console.error(err);
	// 		  })
	// } else {
	//   console.log("Ahh! Your browser does not supports serviceWorker");
	// }

	windowH();

})

function windowH() {
	var wH = $(window).height();
	$('.main-container').css({height: wH-'200'});
}


var openGuidelinesModal = function() {
    $("#modal-guidelines").removeClass('hidden');
}

var openRejectedModal = function() {
	console.log("hi");
	var dataAttr = $(this).attr("data-attribute");
    $(".modal-rejected[data-attribute="+dataAttr+"]").removeClass('hidden');
}

var closeRejectedModal = function() {
	console.log("hi");
	var dataAttr = $(this).attr("data-attribute");
    $(".modal-rejected[data-attribute="+dataAttr+"]").addClass('hidden');
}

$(".jobs_container").on('click','.rejected-message',openRejectedModal);
$(".jobs_container").on('click','.modal .modal-header .close',closeRejectedModal);
$(".jobs_container").on('click','.modal .modal-footer .close-modal',closeRejectedModal);

var closeModal = function() {
    modal.addClass('hidden');
}

var populateProfile = function(res) {
	if(res.status =="success"){
		var data = res["data"][0];
		profile.find(".edit_profile img").attr('src', data["img_link"]);
		profile.find(".user_name").text(data["name"]).removeClass("animated-background");
		profile.find(".user-about").text(data["about"]).removeClass("animated-background");
		profile.find(".user_designation").html(data["desg"]+" at "+"<a class='organisation-url link-color' href="+data["wurl"]+">"+data["org"]+"</a>").removeClass("animated-background");
		profile.find(".extra_info .viewed").text("Viewed: "+data["hits"]).removeClass("animated-background");
		profile.find(".extra_info .last_login").text("Last Login: "+ISODateToD_M_Y(data["d_login"])).removeClass("animated-background");
		profile.find(".profile_link").text(data["rurl"]).removeClass("animated-background");
		profile.find(".profile_link").attr("href",data["rurl"]);
		profile.find(".user_details .divider").removeClass("hidden");
		if(data["lurl"]) {
			var btn = $('.linked-in').removeClass('hidden');

			btn.attr("href", data["lurl"]);
			$(".social-buttons-connected").append(btn);
		}
		else {
			var btn = $('.linked-in').removeClass('hidden');

			$(".social-buttons-not-connected").append(btn);
		}
		if(data["furl"]) {
			var btn = $('.facebook').removeClass('hidden');

			btn.attr("href", data["furl"]);
			$(".social-buttons-connected").append(btn);
		}
		else {
			var btn = $('.facebook').removeClass('hidden');

			$(".social-buttons-not-connected").append(btn);
		}
		if(data["turl"]) {
			var btn = $('.twitter').removeClass('hidden');

			btn.attr("src", data["turl"]);
			$(".social-buttons-connected").append(btn);
		}
		else {
			var btn = $('.twitter').removeClass('hidden');

			$(".social-buttons-not-connected").append(btn);
		}

	}
}

var populateJobs = function(res){
	console.log(res);
	if(res.status=="success"){
		//	res["data"].sort(compare);
		res["data"].forEach(function(aJob){
			var card = tableRow.clone().removeClass('prototype hidden');
			var status = "" ;
			var rejMssg;
			if(aJob["rej_msg"]){
				rejMssg = aJob["rej_msg"];
			}
			else {
				rejMssg = "Nothing to show";
			}

			card.find(".date").text(ISODateToD_M_Y(aJob["created"]));
			card.find(".title").text(aJob["title"]);
			card.find(".status").append(aJob["status"]+"<i data-attribute="+aJob["timestamp"]+" class='rejected-message fa fa-question' aria-hidden='true'><span class='tooltip-message'>"+rejMssg+"</span></i>");
			card.find(".modal").attr("data-attribute",aJob["timestamp"]);
			card.find(".modal .modal-header .close").attr("data-attribute",aJob["timestamp"]);
			card.find(".modal .modal-footer .close-modal").attr("data-attribute",aJob["timestamp"]);
			card.find(".modal .modal-content .modal-center .list").text(rejMssg);
			card.find(".action").append(aJob["loc"]+"<div class='edit-job-container'><img src='https://static.iimjobs.com/recruiter/resources/images/edit-grey.png'></div>");
			card.find(".views").html(( aJob["views"])? aJob["views"]+" views "+( (aJob["applied"])? '<div class="applied-link"><a class="link-color" href="/job/'+aJob["id"]+'/candidates?title='+aJob["title"]+'">'+aJob["applied"]+'applied</a></div>'+  "": "0)" ): "" )
			$('.jobs_container').append(card);
		})
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

function compare(a,b) {
  if (a.created < b.created)
    return 1;
  if (a.created > b.created)
    return -1;
  return 0;
}
