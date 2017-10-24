

var channelsArray = [{
        "id": 9443,
        "jobseekerID": "511594",
        "jobID": "334895",
        "name": "iimjobs--r45058-j511594",
        "lastActive": "2012-07-14T01:00:00+01:00"
    }, {
        "id": 24615,
        "jobseekerID": "709365",
        "jobID": "334895",
        "name": "iimjobs--r45058-j709365",
        "lastActive": "2012-07-14T01:00:00+01:00"
    }, {
        "id": 24608,
        "jobseekerID": "612792",
        "jobID": "334895",
        "name": "iimjobs--r45058-j612792",
        "lastActive": "2012-07-14T01:00:00+01:00"
    }, {
        "id": 24607,
        "jobseekerID": "110923",
        "jobID": "334895",
        "name": "iimjobs--r45058-j110923",
        "lastActive": "2012-07-14T01:00:00+01:00"
    }, {
        "id": 24606,
        "jobseekerID": "711080",
        "jobID": "334895",
        "name": "iimjobs--r45058-j711080",
        "lastActive": "2012-07-14T01:00:00+01:00"
    }, {
        "id": 23623,
        "jobseekerID": "706831",
        "jobID": "334895",
        "name": "iimjobs--r45058-j706831",
        "lastActive": "2012-07-14T01:00:00+01:00"
    }, {
        "id": 23622,
        "jobseekerID": "676776",
        "jobID": "334895",
        "name": "iimjobs--r45058-j676776",
        "lastActive": "2012-07-14T01:00:00+01:00"
    }, {
        "id": 23621,
        "jobseekerID": "712558",
        "jobID": "334895",
        "name": "iimjobs--r45058-j712558",
        "lastActive": "2012-07-14T01:00:00+01:00"
    }, {
        "id": 22909,
        "jobseekerID": "337587",
        "jobID": "0",
        "name": "iimjobs--r45058-j337587",
        "lastActive": "2012-07-14T01:00:00+01:00"
    }, {
        "id": 9441,
        "jobseekerID": "651703",
        "jobID": "334895",
        "name": "iimjobs--r45058-j651703",
        "lastActive": "2012-07-14T01:00:00+01:00"
    }, {
        "id": 9531,
        "jobseekerID": "462122",
        "jobID": "334895",
        "name": "iimjobs--r45058-j462122",
        "lastActive": "2012-07-14T01:00:00+01:00"
    }, {
        "id": 9497,
        "jobseekerID": "178541",
        "jobID": "0",
        "name": "iimjobs--r45058-j178541",
        "lastActive": "2016-05-2109:27:05"
    }, {
        "id": 9643,
        "jobseekerID": "699540",
        "jobID": "0",
        "name": "iimjobs--r45058-j699540",
        "lastActive": "2016-05-1810:59:43"
    }, {
        "id": 9411,
        "jobseekerID": "293084",
        "jobID": "334895",
        "name": "iimjobs--r45058-j293084",
        "lastActive": "2016-05-1613:09:53"
    }, {
        "id": 9388,
        "jobseekerID": "62147",
        "jobID": "334895",
        "name": "iimjobs--r45058-j62147",
        "lastActive": "2016-05-1422:24:58"
    }, {
        "id": 9341,
        "jobseekerID": "419400",
        "jobID": "0",
        "name": "iimjobs--r45058-j419400",
        "lastActive": "2016-05-1315:30:08"
    }, {
        "id": 9335,
        "jobseekerID": "480373",
        "jobID": "334895",
        "name": "iimjobs--r45058-j480373",
        "lastActive": "2016-05-1315:10:04"
    }, {
        "id": 30680,
        "jobseekerID": "260854",
        "jobID": "0",
        "name": "iimjobs--r45058-j260854",
        "lastActive": "NULL"
    }, {
        "id": 9644,
        "jobseekerID": "429324",
        "jobID": "0",
        "name": "iimjobs--r45058-j429324",
        "lastActive": "NULL"
    }, {
        "id": 9448,
        "jobseekerID": "712518",
        "jobID": "334895",
        "name": "iimjobs--r45058-j712518",
        "lastActive": "NULL"
    }, {
        "id": 9396,
        "jobseekerID": "435817",
        "jobID": "0",
        "name": "iimjobs--r45058-j435817",
        "lastActive": "NULL"
    }, {
        "id": 35214,
        "jobseekerID": "229312",
        "jobID": "0",
        "name": "iimjobs--r45058-j229312",
        "lastActive": "NULL"
}];

var recruiterID = localStorage.id;
var recruiterEmail;
var recruiterName;
var recruiterImage;
var chatContainer = $(".chat-div");
var chatDivBox = $(".chat-div-candidate.prototype");
var candidatesWrapper = $(".candidate-card.prototype");


$(document).ready(function(){
	getRequest(baseUrl+"/recruiter/"+recruiterID, {}, function(res) {
        if(res.status =="success") {
    		recruiterEmail = res["data"][0]["email"];
            recruiterName = res["data"][0]["name"];
    		recruiterImage = res["data"][0]["img_link"];
        }
    });

        $('.chat-div .chat-div-header').click(function() {

            $('.chat-div .chat-div-content').toggleClass("show");
            //$('.chat-div .minus-icon').toggleClass("show");
        });
        populateStickyChatView(channelsArray);
});


var stickySendMessage = function(event) {
    var key = event.which;
    var channel = $(this).attr("data-id");
    if(key == 13) {
        var message = $(this).val();

        $(".chat-candidate-boxes .chat-div-candidate[data-id="+channel+"] .content-footer-container .chat-div-content").append("<div class='message-container right'><div class='message-sent'>"+message+"<span class='current-time'>"+startTime()+"</span><span class='tick'></span></div></div>");
        stickyScrollToBottom();
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

var isShowCollapsedCandidate = 0;
var count = 0;

chatContainer.on('click','.candidate-card', function() {
	console.log("hi");
	if(!($(this).hasClass("selected"))) {
		var chatContainerBox = chatDivBox.clone().removeClass('prototype hidden');
        var dataID = $(this).find(".candidate-name").text();
		chatContainerBox.find(".candidate-name").text(dataID);
		chatContainerBox.find(".last-active-date").text(startTime());
		chatContainerBox.find(".chat-div-header").attr("data-id",dataID);
		chatContainerBox.find(".info-buttons .info-icon").attr("data-id",dataID);
		chatContainerBox.find(".info-buttons .minus-icon").attr("data-id",dataID);
		chatContainerBox.find(".info-buttons .close-icon").attr("data-id",dataID);
		chatContainerBox.attr("data-id",dataID);

        chatContainerBox.find(".content-footer-container .footer .chat-input").attr("data-id", dataID);

		fetchHistory(chatContainerBox.find(".candidate-name").text(), 20 , function(status, response) {
            response["messages"].forEach(function(elem, index){
                var postedTime = ISODateToTime(elem["entry"]["time"]);
                elem["entry"]["time"] = ISODateToD_M_Y(elem["entry"]["time"]);

                if(index == 0) {
                    $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content").append("<div class='date-block '><div class='date'>"+elem["entry"]["time"]+"</div></div>");

                }
                if (index > 0 && (response["messages"][index - 1]["entry"]["time"] != elem["entry"]["time"])) {
                        $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content").append("<div class='date-block '><div class='date'>"+elem["entry"]["time"]+"</div></div>");
                }
                if(elem["entry"]["name"] == recruiterName){
                    $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content").append("<div class='message-container right'><div class='message-sent'>"+elem["entry"]["msg"]+"<span class='current-time'>"+postedTime+"</span><span class='tick'></span></div></div>")
                }
                else {
                    $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content").append("<div class='message-container left'><div class='message-received'>"+elem["entry"]["msg"]+"<div class='caret'></div><span class='current-time'>"+postedTime+"</span></div></div>")
                }
            })
            stickyScrollToBottom();
        })

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
        $('.chat-candidate-boxes .chat-div-candidate[data-id='+dataID+'] .content-footer-container').toggleClass("show");
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
    // console.log("bye");
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

var populateStickyChatView = function(array) {

	array.forEach(function(aCandidate) {

		var card = candidatesWrapper.clone().removeClass('prototype hidden');
		card.find(".candidate-image img").attr("src",recruiter["img_url"]).removeClass("animated-background");
        card.attr("data-id",aCandidate["name"]);
        card.find(".candidate-name").text(aCandidate["name"]).removeClass("animated-background");
        card.find(".candidate-designation").text(aCandidate["jobseekerID"]).removeClass("animated-background");
        card.find(".last-active-date").text(ISODateToD_M(aCandidate["lastActive"]));
		$(".chat-div .chat-div-content").append(card);
		$(".chat-div .chat-div-content").append("<hr class='divider divider-full'>");
	})
}

$(".chat-candidate-boxes").on('click','.chat-div-candidate .chat-div-header', function() {
	var dataId = $(this).attr("data-id");
	$('.chat-div-candidate[data-id='+dataId+'] .content-footer-container').toggleClass("show");
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

var stickyScrollToBottom = function() {
    $(".chat-candidate-boxes").find(".chat-div-candidate .chat-div-content").scrollTop($(".chat-candidate-boxes").find(".chat-div-candidate .chat-div-content")[0].scrollHeight);
}

var receivePresence = function(presence) {
    var uuid = getUUID();
    if(presence["action"] == "join" && presence["occupancy"] >= 2 && presence["uuid"] != uuid) {
        $(".chat-div .candidate-card[data-id="+presence["channel"]+"]").find(".candidate-image .online-icon").removeClass("hidden");
    }
    else if (presence["action"] == "leave" && presence["occupancy"] < 2 && presence["uuid"] != uuid) {
        $(".chat-div .candidate-card[data-id="+presence["channel"]+"]").find(".candidate-image .online-icon").addClass("hidden");
    }
}

var showOnlineIcon = function (channel) {
    $(".chat-div .candidate-card[data-id="+channel+"]").find(".candidate-image .online-icon").removeClass("hidden");
}

var removeOnlineIcon = function (channel) {
    $(".chat-div .candidate-card[data-id="+channel+"]").find(".candidate-image .online-icon").addClass("hidden");
}

var receiveMessage = function(message, channelName) {

    if( message["deviceID"] == getCookie("sessID") && message["UUID"] == btoa(recruiterID+'--'+recruiterEmail) ){
        return
    }
    if($(".chat-candidate-boxes").children().length > 0) {
        if($(".chat-div .candidate-card[data-id="+channelName+"]").hasClass("selected")) {
            $(".chat-candidate-boxes .chat-div-candidate[data-id="+channelName+"] .content-footer-container .chat-div-content").append("<div class='message-container left'><div class='message-received'>"+message["msg"]+"<div class='caret'></div><span class='current-time'>"+startTime()+"</span></div></div>")
            stickyScrollToBottom();
        }
        else {
            var chatContainerBox = chatDivBox.clone().removeClass('prototype hidden');

            chatContainerBox.find(".candidate-name").text(channelName);
            chatContainerBox.find(".last-active-date").text(startTime());
            chatContainerBox.find(".chat-div-header").attr("data-id",channelName);
            chatContainerBox.find(".info-buttons .info-icon").attr("data-id",channelName);
            chatContainerBox.find(".info-buttons .minus-icon").attr("data-id",channelName);
            chatContainerBox.find(".info-buttons .close-icon").attr("data-id",channelName);
            chatContainerBox.attr("data-id",channelName);

            chatContainerBox.find(".content-footer-container .footer .chat-input").attr("data-id", channelName);
            fetchHistory(channelName, 20 , function(status, response) {
                response["messages"].forEach(function(elem, index){
                    var postedTime = ISODateToTime(elem["entry"]["time"]);
                    elem["entry"]["time"] = ISODateToD_M_Y(elem["entry"]["time"]);

                    if(index == 0) {
                        $(".chat-candidate-boxes .chat-div-candidate[data-id="+channelName+"] .content-footer-container .chat-div-content").append("<div class='date-block '><div class='date'>"+elem["entry"]["time"]+"</div></div>");

                    }
                    if (index > 0 && (response["messages"][index - 1]["entry"]["time"] != elem["entry"]["time"])) {
                            $(".chat-candidate-boxes .chat-div-candidate[data-id="+channelName+"] .content-footer-container .chat-div-content").append("<div class='date-block '><div class='date'>"+elem["entry"]["time"]+"</div></div>");
                    }
                    if(elem["entry"]["name"] == recruiterName){
                        $(".chat-candidate-boxes .chat-div-candidate[data-id="+channelName+"] .content-footer-container .chat-div-content").append("<div class='message-container right'><div class='message-sent'>"+elem["entry"]["msg"]+"<span class='current-time'>"+postedTime+"</span><span class='tick'></span></div></div>")
                    }
                    else {
                        $(".chat-candidate-boxes .chat-div-candidate[data-id="+channelName+"] .content-footer-container .chat-div-content").append("<div class='message-container left'><div class='message-received'>"+elem["entry"]["msg"]+"<div class='caret'></div><span class='current-time'>"+postedTime+"</span></div></div>")
                    }
                })
                stickyScrollToBottom();
            })

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
            $('.chat-candidate-boxes .chat-div-candidate[data-id='+channelName+'] .content-footer-container').toggleClass("show");
            reposition_chat_windows();
            $(".chat-div .candidate-card[data-id="+channelName+"]").addClass("selected");
            $(".chat-candidate-boxes .chat-div-candidate[data-id="+channelName+"] .content-footer-container .chat-div-content").append("<div class='message-container left'><div class='message-received'>"+message["msg"]+"<div class='caret'></div><span class='current-time'>"+startTime()+"</span></div></div>")
            stickyScrollToBottom();
        }
    }
    else {
        var chatContainerBox = chatDivBox.clone().removeClass('prototype hidden');

        chatContainerBox.find(".candidate-name").text(channelName);
        chatContainerBox.find(".last-active-date").text(startTime());
        chatContainerBox.find(".chat-div-header").attr("data-id",channelName);
        chatContainerBox.find(".info-buttons .info-icon").attr("data-id",channelName);
        chatContainerBox.find(".info-buttons .minus-icon").attr("data-id",channelName);
        chatContainerBox.find(".info-buttons .close-icon").attr("data-id",channelName);
        chatContainerBox.attr("data-id",channelName);

        chatContainerBox.find(".content-footer-container .footer .chat-input").attr("data-id", channelName);
        console.log(channelName);
        fetchHistory(channelName, 20 , function(status, response) {
            console.log(response);
            response["messages"].forEach(function(elem, index){
                var postedTime = ISODateToTime(elem["entry"]["time"]);
                elem["entry"]["time"] = ISODateToD_M_Y(elem["entry"]["time"]);

                if(index == 0) {
                    $(".chat-candidate-boxes .chat-div-candidate[data-id="+channelName+"] .content-footer-container .chat-div-content").append("<div class='date-block '><div class='date'>"+elem["entry"]["time"]+"</div></div>");

                }
                if (index > 0 && (response["messages"][index - 1]["entry"]["time"] != elem["entry"]["time"])) {
                        $(".chat-candidate-boxes .chat-div-candidate[data-id="+channelName+"] .content-footer-container .chat-div-content").append("<div class='date-block '><div class='date'>"+elem["entry"]["time"]+"</div></div>");
                }
                if(elem["entry"]["name"] == recruiterName){
                    $(".chat-candidate-boxes .chat-div-candidate[data-id="+channelName+"] .content-footer-container .chat-div-content").append("<div class='message-container right'><div class='message-sent'>"+elem["entry"]["msg"]+"<span class='current-time'>"+postedTime+"</span><span class='tick'></span></div></div>")
                }
                else {
                    $(".chat-candidate-boxes .chat-div-candidate[data-id="+channelName+"] .content-footer-container .chat-div-content").append("<div class='message-container left'><div class='message-received'>"+elem["entry"]["msg"]+"<div class='caret'></div><span class='current-time'>"+postedTime+"</span></div></div>")
                }
            })
            stickyScrollToBottom();
        })

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
        $(".chat-div .candidate-card[data-id="+channelName+"]").addClass("selected");
        $(".chat-candidate-boxes .chat-div-candidate[data-id="+channelName+"] .content-footer-container .chat-div-content").append("<div class='message-container left'><div class='message-received'>"+message["msg"]+"<div class='caret'></div><span class='current-time'>"+startTime()+"</span></div></div>")
        stickyScrollToBottom();
        $('.chat-candidate-boxes .chat-div-candidate[data-id='+channelName+'] .content-footer-container').toggleClass("show");
    }

// $('.chat-div .chat-div-content').toggleClass("show");
}


$(".chat-candidate-boxes").on('keypress','.chat-input', stickySendMessage);



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
