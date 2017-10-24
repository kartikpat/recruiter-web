var candidatesWrapper = $(".candidate-card.prototype");
var chatSideHeader = $(".chat-side-profile-header");
var chatMainContainer = $(".candidate-chat-container");


var recruiterID = localStorage.id;
var recruiterEmail;
var recruiterName;
var recruiterImage;

getRequest(baseUrl+"/recruiter/"+recruiterID, {}, function(res) {

    if(res["status"] == "success") {
        recruiterEmail = res["data"][0]["email"];
        recruiterName = res["data"][0]["name"];
        recruiterImage = res["data"][0]["img_link"];
        populateChatView(channelsArray);
        populateMainView();
    }


});

var sendMessage = function(event) {
    var key = event.which;
    var channel = $(this).attr("data-id");
    if(key == 13) {
        var message = $(this).val();

        $(".candidate-chat-container[data-id="+channel+"] .candidate-chat-content").append("<div class='message-container right'><div class='message-sent'>"+message+"<span class='current-time'>"+startTime()+"</span><span class='tick'></span></div></div>");
        scrollToBottom();
        publish({
            UUID: btoa(recruiterID+'--'+recruiterEmail),
            deviceID: getCookie("sessID"),
            time: Date.now(),
            usr: recruiterID,
            name: recruiterName,
            tt:1,
            msg: message,
            img: recruiterImage,
            type: 1
        }, channel, function(m){
            console.log("message sent");
        })
        $(this).val('');
    }
}


var populateChatView = function(array) {

    $(".chat-side-profile-candidates .candidates-wrapper").addClass("hidden");
    chatSideHeader.find(".profile-image img").attr("src",recruiterImage).removeClass("animated-background");
    chatSideHeader.find(".profile-info-name").text(recruiterName).removeClass("animated-background");
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
        card.find(".new-message-icon").attr("data-id",0);
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
    $(".candidate-card[data-name="+obj["name"]+"] .new-message-icon").addClass("hidden");
    $(".candidate-card[data-name="+obj["name"]+"] .new-message-icon").attr("data-id",0);
    fetchHistory(obj["name"], 20 , onFetchHistory);

    if(!(chatMainContainer.find(".welcome-message-container").hasClass("hidden"))) {
        chatMainContainer.find(".welcome-message-container").addClass("hidden");
    }
    if(chatMainContainer.find(".candidate-chat-messages-container").hasClass("hidden")) {
        chatMainContainer.find(".candidate-chat-messages-container").removeClass("hidden");
    }
    chatMainContainer.attr("data-id", candidateName);
    chatMainContainer.find(".candidate-chat-messages-container .candidate-chat-footer .text-message").attr("data-id", candidateName);
    chatMainContainer.find(".candidate-chat-messages-container .profile-image img").attr("src",$(this).find(".candidate-image img").attr("src")).removeClass("animated-background");
    chatMainContainer.find(".candidate-chat-messages-container .profile-info-name").text($(this).find(".candidate-name").text()).removeClass("animated-background");
    chatMainContainer.find(".candidate-chat-messages-container .profile-info-organisation").text($(this).find(".candidate-designation").text()).removeClass("animated-background");
    // obj["message"].forEach(function(val) {
    //     chatMainContainer.find(".candidate-chat-messages-container .candidate-chat-content").append("<div class='message-container left'><div class='left-message'>"+val["mssg"]+"<span class='current-time'>"+val["time"]+"</span></div></div>")
    // })
})

var onFetchHistory = function(status, response) {
    console.log(response);
    // if(response["messages"].length == 0) {
    //      chatMainContainer.find(".candidate-chat-messages-container .candidate-chat-content").text("No messages to display");
    // }

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
            if(elem["entry"]["name"] == recruiterName){
                chatMainContainer.find(".candidate-chat-messages-container .candidate-chat-content").append("<div class='message-container right'><div class='message-sent'>"+elem["entry"]["msg"]+"<span class='current-time'>"+postedTime+"</span><span class='tick'></span></div></div>")
            }
            else {
                chatMainContainer.find(".candidate-chat-messages-container .candidate-chat-content").append("<div class='message-container left'><div class='message-received'>"+elem["entry"]["msg"]+"<div class='caret'></div><span class='current-time'>"+postedTime+"</span></div></div>")
            }
        })
        scrollToBottom();

}

var scrollToBottom = function () {
    chatMainContainer.find(".candidate-chat-messages-container .candidate-chat-content").scrollTop($(".candidate-chat-content")[0].scrollHeight);
}



var receivePresence = function(presence) {
    var uuid = getUUID();
    if(presence["action"] == "join" && presence["occupancy"] >= 2 && presence["uuid"] != uuid) {
        $(".chat-side-profile-candidates .candidate-card[data-name="+presence["channel"]+"]").find(".candidate-image .online-icon").removeClass("hidden");
    }
    else if (presence["action"] == "leave" && presence["occupancy"] < 2 && presence["uuid"] != uuid) {
        $(".chat-side-profile-candidates .candidate-card[data-name="+presence["channel"]+"]").find(".candidate-image .online-icon").addClass("hidden");
    }
}

var showOnlineIcon = function (channel) {
    $(".chat-side-profile-candidates .candidate-card[data-name="+channel+"]").find(".candidate-image .online-icon").removeClass("hidden");
}

var removeOnlineIcon = function (channel) {
    $(".chat-side-profile-candidates .candidate-card[data-name="+channel+"]").find(".candidate-image .online-icon").addClass("hidden");
}

var receiveMessage = function(message, channelName) {
    if( message["deviceID"] == getCookie("sessID") && message["UUID"] == btoa(recruiterID+'--'+recruiterEmail) ){
        return
    }
    if(($(".candidate-chat-container").attr("data-id")) == channelName ) {
        $(".candidate-card[data-name="+channelName+"] .new-message-icon").addClass("hidden");
    }
    else {
        var dataId = $(".candidate-card[data-name="+channelName+"] .new-message-icon").attr("data-id");
        $(".candidate-card[data-name="+channelName+"] .new-message-icon").attr("data-id",Number(dataId)+1);
        $(".candidate-card[data-name="+channelName+"] .new-message-icon").text($(".candidate-card[data-name="+channelName+"] .new-message-icon").attr("data-id"));
        $(".candidate-card[data-name="+channelName+"] .new-message-icon").removeClass("hidden");
    }
    $(".candidate-chat-container[data-id="+channelName+"] .candidate-chat-messages-container .candidate-chat-content").append("<div class='message-container left'><div class='message-received'>"+message["msg"]+"<span class='current-time'>"+startTime()+"</span></div></div>")
    scrollToBottom();

    $(".chat-candidate-boxes .chat-div-candidate[data-id="+channelName+"] .content-footer-container .chat-div-content").append("<div class='message-container left'><div class='message-received'>"+message["msg"]+"<div class='caret'></div><span class='current-time'>"+startTime()+"</span></div></div>")
    stickyScrollToBottom();
}

$(".chat-side-profile-candidates").on('click', '.candidate-card .remove-candidate', function(event) {
    event.stopPropagation();
    var dataName = $(this).parent().attr("data-name");
    console.log(dataName);
    unsubscribe(dataName);
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

     $(".text-message").keypress(sendMessage);
     $("#search-candidate").on('input', function(){
 		var ele = this;
 		searchCandidate(channelsArray, ele);
 	});

    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    $(".chat-side-profile-candidates").height(windowHeight - 129);
    $(".candidate-chat-container").width(windowWidth - 305);
    $(window).resize(function(){
        $(".candidate-chat-container").width($(window).width() - 305);
    });

    chatMainContainer.find(".candidate-chat-messages-container .candidate-chat-content").height(windowHeight - 140);



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
