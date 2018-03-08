
var userProfile = $(".user_profile_side");
var navBar = $(".navbar");
var chatContainer = $(".chat-div");
var chatDivBox = $(".chat-div-candidate.prototype");
var candidatesWrapper = $(".candidate-card.prototype");


$(document).ready(function(){

	userProfile.find(".dropdown").hover(showMenu);
	navBar.find(".menu-calendar").hover(showMenuCalendar);
	navBar.find(".menu-more").hover(showMenuMore);
	navBar.find(".manage-bookings").click(showAllCalendars);
	$('.chat-div .chat-div-header').click(function() {
		$(this).find(".minus-icon").toggleClass("active")
		$('.chat-div .chat-div-content').toggleClass("show");
		//$('.chat-div .minus-icon').toggleClass("show");
	});
	getRequest(baseUrl+"/recruiter/"+recruiterId+"/chat", {}, function(res){
		if(res.status && res.status =='success'){
			populateChatView(res.data);
		}

	});

	$("#search-solar").keyup(function(event){
    if(event.keyCode == 13){
        var queryParameter = $(this).val();
		window.location = "/recruiter/filter-candidate?queryParameter="+queryParameter;
    }
});
	$(".saved-shortlisted").click(function(event) {
		event.preventDefault();
		window.location = "/recruiter/filter-candidate";
	})
})

var showAllCalendars = function(event) {
	event.preventDefault();
	window.location =  "/recruiter/" + recruiterID + "/calendar";
}

var showMenu = function() {
	userProfile.find(".options").toggleClass("hidden");
}

var showMenuCalendar = function() {
	navBar.find(".menu-calendar .options").toggleClass("hidden");
}

var showMenuMore = function() {
	navBar.find(".menu-more .options").toggleClass("hidden");
}

var populateHeader = function(res) {
	console.log(res);
    if(res.status =="success") {
        userProfile.find('.email').append(res["data"][0]["email"]+"<i class='email-caret fa fa-caret-down' aria-hidden='true'></i>").removeClass("animated-background");
		userProfile.find('.image-container img').attr('src', res["data"][0]["img_link"]).removeClass("animated-background");
    }
}

var isShowCollapsedCandidate = 0;
var count = 0;

chatContainer.on('click','.candidate-card', function() {
	console.log("hi");
	if(!($(this).hasClass("selected"))) {
		var chatContainerBox = chatDivBox.clone().removeClass('prototype hidden');
		chatContainerBox.find(".candidate-name").text($(this).find(".candidate-name").text());
		chatContainerBox.find(".last-active-date").text(startTime());
		chatContainerBox.find(".chat-div-header").attr("data-id",$(this).attr("data-id"));
		chatContainerBox.find(".info-buttons .info-icon").attr("data-id",$(this).attr("data-id"));
		chatContainerBox.find(".info-buttons .minus-icon").attr("data-id",$(this).attr("data-id"));
		chatContainerBox.find(".info-buttons .close-icon").attr("data-id",$(this).attr("data-id"));
		chatContainerBox.attr("data-id",$(this).attr("data-id"));
		var dataID = chatContainerBox.attr("data-id");
        console.log(chatContainerBox.find(".candidate-name").text())
		fetchHistory(chatContainerBox.find(".candidate-name").text(), 20 , function(status, response) {
		    console.log(response);
		    response["messages"].forEach(function(elem, index){
		        var postedTime = ISODateToTime(elem["entry"]["time"]);
		        elem["entry"]["time"] = ISODateToD_M_Y(elem["entry"]["time"]);

		        if(index == 0) {
					$(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content").append("<div class='date-block '><div class='date'>"+elem["entry"]["time"]+"</div></div>");

		        }
		        if (index > 0 && (response["messages"][index - 1]["entry"]["time"] != elem["entry"]["time"])) {
		             	$(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content").append("<div class='date-block '><div class='date'>"+elem["entry"]["time"]+"</div></div>");
		        }
		         $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content").append("<div class='message-container left'><div class='message-received'>"+elem["entry"]["msg"]+"<div class='caret'></div><span class='current-time'>"+postedTime+"</span></div></div>")
		    })
		});
		if($(".chat-candidate-boxes").children().length < maxCandidateChats) {
		    $(".chat-candidate-boxes").prepend(chatContainerBox);
		}
		else {
			var clonedElement = $(".candidate-collapsed-block.prototype").clone().removeClass('prototype hidden');
			$(".chat-candidate-boxes").prepend(chatContainerBox);
			var hideElement = 1+maxCandidateChats;
			var dataIdLocal = $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").attr("data-id");
			clonedElement.attr("data-id",dataIdLocal);
			clonedElement.html($(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").find(".candidate-name").text()+"<i data-id="+dataIdLocal+" class='fa fa-times' aria-hidden='true'></i>");
			$(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").addClass("hidden");
			if($(".chat-collapsed-candidate-container").hasClass("hidden")) {
				$(".chat-collapsed-candidate-container").removeClass("hidden");
			}
			$(".chat-collapsed-candidate-container .chat-collapsed-candidate .chat-collapsed-candidate-wrapper").append(clonedElement);

		}
		reposition_chat_windows();
		$(this).addClass("selected");
	}
})



$("#chat-collapsed-container").on('click',".chat-collapsed-candidate-container .candidate-collapsed-block i", function(event) {
	event.stopPropagation();
	var dataId = $(this).attr("data-id");
	console.log(dataId)
	$("#chat-collapsed-container .candidate-collapsed-block[data-id="+dataId+"]").remove();
    $('.chat-div-candidate[data-id='+dataId+']').remove();
	chatContainer.find(".candidate-card[data-id="+dataId+"]").removeClass("selected");
	if($(".chat-collapsed-candidate-container .chat-collapsed-candidate-wrapper").children().length == 0) {
		$(".chat-collapsed-candidate-container").addClass("hidden");
	}
})

$("#chat-collapsed-container").on('click',".chat-collapsed-candidate-container .candidate-collapsed-block", function(event) {
    console.log("bye");
	var dataId = $(this).attr("data-id");
    $(this).remove();
    var clonedElement = $(".candidate-collapsed-block.prototype").clone().removeClass('prototype hidden');
    var hideElement = maxCandidateChats;
    var elem = $(".chat-candidate-boxes .chat-div-candidate:not(.hidden)").get(maxCandidateChats-1);
    console.log(elem);
    var dataIdLocal = $(elem).attr("data-id");
    clonedElement.attr("data-id",dataIdLocal);
    clonedElement.html($(elem).find(".candidate-name").text()+"<i data-id="+dataIdLocal+" class='fa fa-times' aria-hidden='true'></i>");
    //$(this).attr("data-id",$('.chat-candidate-boxes .chat-div-candidate:nth-child('+maxCandidateChats+')').attr("data-id"));
    $('.chat-candidate-boxes .chat-div-candidate[data-id='+dataId+']').removeClass("hidden");

    $(elem).addClass("hidden");
    $(".chat-collapsed-candidate-container .chat-collapsed-candidate .chat-collapsed-candidate-wrapper").append(clonedElement);
    reposition_chat_windows();
})

var populateChatView = function(array) {

	array.forEach(function(aCandidate) {

		var card = candidatesWrapper.clone().removeClass('prototype hidden');
		card.find(".candidate-image img").attr("src",(aCandidate["img"] || "/static/images/noimage.png"));
        card.attr("data-id",aCandidate["userId"]);
        card.find(".candidate-name").text(aCandidate["name"]);
        card.find(".candidate-designation").text(aCandidate["designation"]);
		card.attr("data-channel-name" , aCandidate["channel"])
        // card.find(".last-active-date").text(ISODateToD_M(aCandidate["lastActive"]));
		$(".chat-div .chat-div-content").append(card);
		$(".chat-div .chat-div-content").append("<hr class='divider divider-full'>");
	})
}

$(".chat-candidate-boxes").on('click','.chat-div-candidate .chat-div-header', function() {
	var dataId = $(this).attr("data-id");
	$('.chat-div-candidate[data-id='+dataId+'] .content-footer-container').toggleClass("show");
	$('.chat-div-candidate .chat-div-header[data-id='+dataId+'] .minus-icon').toggleClass("active")
})

$(".chat-candidate-boxes").on('click','.chat-div-candidate .info-buttons .close-icon', function() {
	event.stopPropagation();
	var dataId = $(this).attr("data-id");
	hideElement = 1 + maxCandidateChats;
	if($(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").hasClass("hidden")) {
		$(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").removeClass("hidden");
		var collapsedDataId = $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").attr("data-id");
		console.log(collapsedDataId)
		$(".chat-collapsed-candidate-container .candidate-collapsed-block[data-id="+collapsedDataId+"]").remove();
		if($(".chat-collapsed-candidate-container .chat-collapsed-candidate-wrapper").children().length == 0) {
			$(".chat-collapsed-candidate-container").addClass("hidden");
		}
	}
	$('.chat-div-candidate[data-id='+dataId+']').remove();
	chatContainer.find(".candidate-card[data-id="+dataId+"]").removeClass("selected");
	reposition_chat_windows();

})

var displayAMessage = function(event) {
    var key = event.which;
    if(key == 13) {
        $(".chat-candidate-boxes .chat-div-candidate .chat-div-content").append("<div class='message-container right'><div class='message-sent'>"+$(this).val()+"</div></div>");
        $(this).val('');
    }
}

$(".chat-candidate-boxes").on('keypress','#chat-input', displayAMessage);



function reposition_chat_windows() {
    var rightOffset = 290;

    jQuery(".chat-candidate-boxes .chat-div-candidate").each(function(i, el) {
		if(!($(this).hasClass("hidden"))) {
		    jQuery(this).css("right", rightOffset);
		    rightOffset = rightOffset + 280
		}
    });

	if(!($(".chat-collapsed-candidate-container").hasClass("hidden"))) {
		$(".chat-collapsed-candidate-container").css("right", rightOffset );
	}
}

function ISODateToD_M(aDate) {
  var date = new Date(aDate),
	month = date.getMonth(),
	dt = date.getDate();

  if (dt < 10) {
	dt = '0' + dt;
  }
  if (month < 10) {
	month = '0' + month;
  }

  var str = dt + "/" + month;
  return str;

}

function ISODateToD_M_Y(aDate) {
    var monthNames = ["Jan", "Feb", "March", "April", "May", "June",
                        "July", "Aug", "Sep", "Oct", "Nov", "Dec"
                    ];
  var date = new Date(aDate),
	month = monthNames[date.getMonth()],
    year = date.getFullYear(),
	dt = date.getDate();

  if (dt < 10) {
	dt = '0' + dt;
  }
  if (month < 10) {
	month = '0' + month;
  }

  var str = dt + " " + month + " " + year;
  return str;
}

function ISODateToTime(aDate) {
  var date = new Date(aDate),
	hours = date.getHours(),
	mins = date.getMinutes();
    mins = checkTime(mins);
      var str = hours + ":" + mins;
      return str;
}

var recruiterID = localStorage.id;
var maxCandidateChats;
var profile = $(".user_profile");
var tableRow = $(".jobs_content.prototype");

var modal = $('.modal');
var openGuidelines = $("#posting-guidelines");
var closeModalBtn = $(".close");


var displayAMessage = function(event) {
    var key = event.which;
    if(key == 13) {
        $(".chat-candidate-boxes .chat-div-candidate .chat-div-content").append("<div class='message-container right'><div class='message-sent'>"+$(this).val()+"</div></div>");
        $(this).val('');
    }
}


$(document).ready(function(){

        if ($(document).width() < 1000) {
            maxCandidateChats = 1
        } else {
            if ($(document).width() < 1450) {

                maxCandidateChats = 2
            } else {

                maxCandidateChats = 3
            }
        }


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
			var btn = $('.linked-in').clone().removeClass('hidden');

			btn.attr("href", data["lurl"]);
            btn.find("img").attr("src","http://qa100.iimjobs.com/resources/images/in1.png");
			$(".social-buttons-connected").append(btn);
		}
		else {
			var btn = $('.linked-in').clone().removeClass('hidden');
            btn.find("img").attr("src","http://qa100.iimjobs.com/resources/images/innew.png");
			$(".social-buttons-not-connected").append(btn);
		}
		if(data["furl"]) {
			var btn = $('.facebook').clone().removeClass('hidden');

			btn.attr("href", data["furl"]);
            btn.find("img").attr("src","http://qa100.iimjobs.com/resources/images/fb1.png");
			$(".social-buttons-connected").append(btn);
		}
		else {
			var btn = $('.facebook').clone().removeClass('hidden');
            btn.find("img").attr("src","https://static.iimjobs.com/resources/images/fbnew.png");
			$(".social-buttons-not-connected").append(btn);
		}
		if(data["turl"]) {
			var btn = $('.twitter').clone().removeClass('hidden');
            btn.find("img").attr("src","http://qa100.iimjobs.com/resources/images/twtr1.png");
			btn.attr("href", data["turl"]);
			$(".social-buttons-connected").append(btn);
		}
		else {
			var btn = $('.twitter').clone().removeClass('hidden');
            btn.find("img").attr("src","https://static.iimjobs.com/resources/images/twtrnew.png");
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
			card.find(".action").append("<span>"+aJob["loc"]+"</span><span class='edit-job-container'><img src='https://static.iimjobs.com/recruiter/resources/images/edit-grey.png'></span>");
			card.find(".views").html(( aJob["views"])? aJob["views"]+" views "+( (aJob["applied"])? '<span class="applied-link"><a class="link-color" href="/job/'+aJob["id"]+'/candidates?title='+aJob["title"]+'">'+aJob["applied"]+'applied</a></span>'+  "": "0)" ): "" )
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

function checkTime(i) {
 if (i < 10) {
   i = "0" + i;
 }
 return i;
}

function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  // add a zero in front of numbers<10
  m = checkTime(m);
  var time = h + ":" + m;
  return time;
}
