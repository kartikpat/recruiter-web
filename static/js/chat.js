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
    $(".candidate-chat-content").append("<div class='message-container right'><div class='message-sent'>"+message+"<span class='current-time'>"+startTime()+"</span></div></div>");
    var channel = chatMainContainer.attr('data-id');
    console.log(channel);
    publish({
        UUID: btoa(localStorage.recruiterID+'--'+localStorage.recruiterEmail),
        deviceID: getCookie("sessID"),
        time: Date.now(),
        usr: localStorage.recruiterID,
        name: localStorage.recruiterName,
        tt:1,
        msg: message,
        img: localStorage.recruiterImage,
        type: 1
    }, channel, function(m){
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
    array.forEach(function(aCandidate) {
        var card = candidatesWrapper.clone().removeClass('prototype hidden');
        card.find(".candidate-image img").attr("src",recruiter["img_url"]).removeClass("animated-background");
        card.attr("data-id",aCandidate["id"]);
        card.attr("data-name",aCandidate["name"]);
        card.find(".candidate-name").text(aCandidate["name"]).removeClass("animated-background");
        card.find(".candidate-designation").text(aCandidate["jobseekerID"]).removeClass("animated-background");
        card.find(".last-active-date").text(ISODateToD_M(aCandidate["lastActive"]));
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
    var candidateName = $(this).attr("data-name");
    chatMainContainer.find(".candidate-chat-messages-container .candidate-chat-content").empty();
    var obj;
    channelsArray.forEach(function(aCandidate) {
        if(aCandidate["id"] == candidateId) {
            obj = aCandidate;
        }
    })
    fetchHistory(obj["name"], 20 , onFetchHistory);
    if(!(chatMainContainer.find(".welcome-message-container").hasClass("hidden"))) {
        chatMainContainer.find(".welcome-message-container").addClass("hidden");
    }
    if(chatMainContainer.find(".candidate-chat-messages-container").hasClass("hidden")) {
        chatMainContainer.find(".candidate-chat-messages-container").removeClass("hidden");
    }
    chatMainContainer.attr("data-id", candidateName);
    chatMainContainer.find(".candidate-chat-messages-container .profile-image img").attr("src",$(this).find(".candidate-image img").attr("src")).removeClass("animated-background");
    chatMainContainer.find(".candidate-chat-messages-container .profile-info-name").text($(this).find(".candidate-name").text()).removeClass("animated-background");
    chatMainContainer.find(".candidate-chat-messages-container .profile-info-organisation").text($(this).find(".candidate-designation").text()).removeClass("animated-background");
    // obj["message"].forEach(function(val) {
    //     chatMainContainer.find(".candidate-chat-messages-container .candidate-chat-content").append("<div class='message-container left'><div class='left-message'>"+val["mssg"]+"<span class='current-time'>"+val["time"]+"</span></div></div>")
    // })
})

var onFetchHistory = function(status, response) {
    console.log(response);
    response["messages"].forEach(function(elem, index){
        var postedTime = ISODateToTime(elem["entry"]["time"]);
        elem["entry"]["time"] = ISODateToD_M_Y(elem["entry"]["time"]);

        if(index == 0) {
             chatMainContainer.find(".candidate-chat-messages-container .candidate-chat-content").append("<div class='date-block '><div class='date'>"+elem["entry"]["time"]+"</div></div>")
            //  if(elem["entry"])
            //  chatMainContainer.find(".candidate-chat-messages-container .candidate-chat-content").append("<div class='image-name-container'><img src="+elem["entry"]["img"]">"+elem["entry"]["time"]+"</div></div>")
        }
        if (index > 0 && (response["messages"][index - 1]["entry"]["time"] != elem["entry"]["time"])) {
             chatMainContainer.find(".candidate-chat-messages-container .candidate-chat-content").append("<div class='date-block '><div class='date'>"+elem["entry"]["time"]+"</div></div>")
        }
         chatMainContainer.find(".candidate-chat-messages-container .candidate-chat-content").append("<div class='message-container left'><div class='message-received'>"+elem["entry"]["msg"]+"<div class='caret'></div><span class='current-time'>"+postedTime+"</span></div></div>")
    })
}

var receivePresence = function(presence) {
    console.log(presence);
    if(presence["action"] == "join" && presence["occupancy"] > 1) {
        $(".chat-side-profile-candidates .candidate-card[data-name="+presence["channel"]+"]").find(".candidate-image .online-icon").removeClass("hidden");
    }
    console.log(presence);
}

var receiveMessage = function(message) {
    console.log(message)
    if( message["deviceID"] == getCookie("sessID") && message["uuid"] == btoa(localStorage.recruiterID+'--'+localStorage.recruiterEmail) ){
        return
    }
    chatMainContainer.find(".candidate-chat-messages-container .candidate-chat-content").append("<div class='message-container left'><div class='left-message'>"+message["msg"]+"<span class='current-time'>"+startTime()+"</span></div></div>")
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
     populateChatView(channelsArray);
     populateMainView();

     $("#search-candidate").on('input', function(){
 		var ele = this;
 		searchCandidate(channelsArray, ele);
 	});

    var candidateChatContainerHeight = $(".candidate-chat-container").height();
    var candidateChatContainerWidth = $(window).width();
    $(".chat-side-profile-candidates").height(candidateChatContainerHeight - 131);
    $(".candidate-chat-container").width(candidateChatContainerWidth - 270);
    $(window).resize(function(){
        $(".candidate-chat-container").width($(window).width() - 265);
    });



    chatMainContainer.find(".candidate-chat-messages-container .candidate-chat-content").height($(".candidate-chat-container").height() - 163)
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

function ISODateToTime(aDate) {
  var date = new Date(aDate),
	hours = date.getHours(),
	mins = date.getMinutes();
    mins = checkTime(mins);
      var str = hours + ":" + mins;
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
