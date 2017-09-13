var candidatesWrapper = $(".candidate-card.prototype");
var chatSideHeader = $(".chat-side-profile-header");
var chatMainContainer = $(".candidate-chat-container");


var displayAMessage = function(event) {
    var key = event.which;
    if(key == 13) {
        var message = $(this).val();
        sendMessage(message);
        $(this).val('');
    }
}

var sendMessage = function(message) {
    $(".candidate-chat-content").append("<div class='message-container right'><div class='right-message'>"+message+"<span class='current-time'>"+startTime()+"</span></div></div>");
    publish(message,  "iimjobs--r45058-j709365", function(m){
        console.log("message sent");
    })
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

    channelsArray.forEach(function(aCandidate) {
        var card = candidatesWrapper.clone().removeClass('prototype hidden');
        card.find(".candidate-image img").attr("src","http://www.iimjobs.com/resources/img/user_profile_new.png").removeClass("animated-background");
        card.attr("data-id",aCandidate["id"]);
        card.find(".candidate-name").text(aCandidate["jobseekerID"]).removeClass("animated-background");
        card.find(".candidate-designation").text("Software Developer").removeClass("animated-background");
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
    channelsArray.forEach(function(aCandidate) {
        if(aCandidate["id"] == candidateId) {
            obj = aCandidate;
        }
    })
    if(!(chatMainContainer.find(".welcome-message-container").hasClass("hidden"))) {
        chatMainContainer.find(".welcome-message-container").addClass("hidden");
    }
    if(chatMainContainer.find(".candidate-chat-messages-container").hasClass("hidden")) {
        chatMainContainer.find(".candidate-chat-messages-container").removeClass("hidden");
    }
    chatMainContainer.find(".candidate-chat-messages-container .profile-image img").attr("src",$(this).find(".candidate-image img").attr("src")).removeClass("animated-background");
    chatMainContainer.find(".candidate-chat-messages-container .profile-info-name").text($(this).find(".candidate-name").text()).removeClass("animated-background");
    chatMainContainer.find(".candidate-chat-messages-container .profile-info-organisation").text($(this).find(".candidate-designation").text()).removeClass("animated-background");
    // obj["message"].forEach(function(val) {
    //     chatMainContainer.find(".candidate-chat-messages-container .candidate-chat-content").append("<div class='message-container left'><div class='left-message'>"+val["mssg"]+"<span class='current-time'>"+val["time"]+"</span></div></div>")
    // })
})

var receiveMessage = function(message) {
    chatMainContainer.find(".candidate-chat-messages-container .candidate-chat-content").append("<div class='message-container left'><div class='left-message'>"+message+"<span class='current-time'>"+startTime()+"</span></div></div>")
}

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
     populateChatView(candidates);
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
