var candidatesWrapper = $(".candidate-card.prototype");
var chatSideHeader = $(".chat-side-profile-header");
var chatMainContainer = $(".candidate-chat-container");


var displayAMessage = function(event) {
    var key = event.which;
    if(key == 13) {
        $(".candidate-chat-content").append("<div class='message-container right'><div class='right-message'>"+$(this).val()+"<span class='current-time'>"+startTime()+"</span></div></div>");
        $(this).val('');
    }
}

var populateChatView = function(array) {
    $(".chat-side-profile-candidates .candidates-wrapper").addClass("hidden");
    chatSideHeader.find(".profile-image img").attr("src",recruiter["img_url"]).removeClass("animated-background");
    chatSideHeader.find(".profile-info-name").text(recruiter["name"]).removeClass("animated-background");
    if(recruiter["isOnline"] == 1) {
        chatSideHeader.find(".profile-info-isonline").text("online").removeClass("animated-background");
    }
    else {
        chatSideHeader.find(".profile-info-isonline").text("offline").removeClass("animated-background");
    }
    array.forEach(function(aCandidate) {
        var card = candidatesWrapper.clone().removeClass('prototype hidden');
        card.find(".candidate-image img").attr("src",recruiter["img_url"]).removeClass("animated-background");
        card.attr("data-id",aCandidate["id"]);
        card.find(".candidate-name").text(aCandidate["name"]).removeClass("animated-background");
        card.find(".candidate-designation").text(aCandidate["jobseekerID"]).removeClass("animated-background");
        card.find(".last-active-date").text(ISODateToD_M_Y(aCandidate["lastActive"]));
        $(".chat-side-profile-candidates").append(card);
        $(".chat-side-profile-candidates").append("<hr class='divider divider-full'>");
    })
}

var populateMainView = function() {
    chatMainContainer.find(".welcome-message-container").removeClass("hidden");
    chatMainContainer.find(".welcome-message-container .welcome-message-content").text("Hi "+recruiter["name"]);
}

$(".chat-side-profile-candidates").on('click', '.candidate-card', function() {
    var candidateId = $(this).attr("data-id");
    chatMainContainer.find(".candidate-chat-messages-container .candidate-chat-content").empty();
    var obj;
    candidates.forEach(function(aCandidate) {
        if(aCandidate["id"] == candidateId) {
            obj = aCandidate;
        }
    })
    console.log(obj["message"]);
    if(!(chatMainContainer.find(".welcome-message-container").hasClass("hidden"))) {
        chatMainContainer.find(".welcome-message-container").addClass("hidden");
    }
    if(chatMainContainer.find(".candidate-chat-messages-container").hasClass("hidden")) {
        chatMainContainer.find(".candidate-chat-messages-container").removeClass("hidden");
    }
    chatMainContainer.find(".candidate-chat-messages-container .profile-image img").attr("src",$(this).find(".candidate-image img").attr("src")).removeClass("animated-background");
    chatMainContainer.find(".candidate-chat-messages-container .profile-info-name").text($(this).find(".candidate-name").text()).removeClass("animated-background");
    chatMainContainer.find(".candidate-chat-messages-container .profile-info-organisation").text($(this).find(".candidate-designation").text()).removeClass("animated-background");
    obj["message"].forEach(function(val) {
        chatMainContainer.find(".candidate-chat-messages-container .candidate-chat-content").append("<div class='message-container left'><div class='left-message'>"+val["mssg"]+"<span class='current-time'>"+val["time"]+"</span></div></div>")
    })
})

$(".chat-side-profile-candidates").on('click', '.candidate-card .remove-candidate', function(event) {
    event.stopPropagation();
    $(this).parent().next().remove();
    $(this).parent().remove();
    if(chatMainContainer.find(".welcome-message-container").hasClass("hidden")) {
        chatMainContainer.find(".welcome-message-container").removeClass("hidden");
    }
    if(!(chatMainContainer.find(".candidate-chat-messages-container").hasClass("hidden"))) {
        chatMainContainer.find(".candidate-chat-messages-container").addClass("hidden");
    }
})

var searchCandidate = function(array, elem) {
	var str = $(elem).val();
	str=str.toLowerCase();
	//var dataAttribute = metaData["data-attribute"];
	var resultTags = []
    for (var i=0; i < array.length; i++) {
        if (array[i]["name"] && array[i]["name"].toLowerCase().indexOf(str)>-1) {
            resultTags.push(array[i]);
        }
    }
	$(".chat-side-profile-candidates").empty();
	populateChatView(resultTags);
}

 $(document).ready(function() {
     $("#text-message").keypress(displayAMessage);
     populateChatView(channelsArray);
     populateMainView();

     $("#search-candidate").on('input', function(){
 		var ele = this;
 		searchCandidate(candidates, ele);
 	});

 })

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
