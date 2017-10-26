var recruiterID = localStorage.id;

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

profile.on('click',".social-buttons-not-connected .social-links.facebook", function(event) {
    event.preventDefault();
    hello('facebook').login().then(function(auth){
        console.log(auth.network)
        hello(auth.network).api('me?fields=link').then(function(json) {
            profile.find(".social-buttons-not-connected .social-links.facebook").remove();
            var btn = $('.facebook').clone().removeClass('hidden');
			btn.attr("href", json["link"]);
            btn.find("img").attr("src","http://qa100.iimjobs.com/resources/images/fb1.png");
			$(".social-buttons-connected").append(btn);

        }, function(e) {
            alert('Whoops! ' + e.error.message);
        });
    });
});

profile.on('click',".social-buttons-not-connected .social-links.twitter", function(event) {
    event.preventDefault();
    hello('twitter').login().then(function(auth){
        console.log(auth)
        hello(auth.network).api('me').then(function(json) {
            console.log(json)
            profile.find(".social-buttons-not-connected .social-links.twitter").remove();
            var btn = $('.twitter').clone().removeClass('hidden');
            btn.find("img").attr("src","http://qa100.iimjobs.com/resources/images/twtr1.png");
			btn.attr("href", "https://twitter.com/"+json["screen_name"]);
			$(".social-buttons-connected").append(btn);


        }, function(e) {
            alert('Whoops! ' + e.error.message);
        });
    }, function(e) {
        alert('Whoops! ' + e.error.message);
    });
});

profile.on('click',".social-buttons-not-connected .social-links.linked-in", function(event) {
    event.preventDefault();
    hello('linkedin').login().then(function(auth){
        console.log(auth)
        hello(auth.network).api('me').then(function(json) {
            console.log(json)
            profile.find(".social-buttons-not-connected .social-links.linked-in").remove();
            var btn = $('.linked-in').clone().removeClass('hidden');
            btn.find("img").attr("src","http://qa100.iimjobs.com/resources/images/in1.png");
			//btn.attr("href", "https://twitter.com/"+json["screen_name"]);
			$(".social-buttons-connected").append(btn);


        }, function(e) {
            alert('Whoops! ' + e.error.message);
        });
    }, function(e) {
        alert('Whoops! ' + e.error.message);
    });
});

hello.init({
	facebook: '1530995060277473',
    linkedin: '81mt7lu5kzjey3',
    twitter: 'JENpmbzmuZQXd0Ga2I1jzmxL9'
}, {redirect_uri: '/'});

// hello.init({
//     twitter: 'JENpmbzmuZQXd0Ga2I1jzmxL9'
// }, {redirect_uri: 'http://127.0.0.1:8000'})






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
	//windowH();

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

                card.find(".location").text(aJob["loc"]);

			card.find(".action").append("<span class='edit-job-container'><img src='https://static.iimjobs.com/recruiter/resources/images/edit-grey.png'></span>");
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
