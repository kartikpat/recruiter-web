var userProfile = $(".user_profile_side");
var navBar = $(".navbar");
var chatContainer = $(".chat-div");
var chatDivBox = $(".chat-div-candidate.prototype");
var candidatesWrapper = $(".candidate-card.prototype");
var recruiterName = profile.name
var recruiterEmail = profile.email

var stat = {
    "": "Unread",
    1: "Shortlisted",
    2: "Rejected",
    3: "Saved",
    "4,5": "Reviewed"
};

var chatStore= {}
function saveToStore(dataArray){
    dataArray.forEach(function(anObj) {
        chatStore[anObj["userId"]] = anObj;
    })
}

// function emptyStore(){
//     chatStore = {};
// }

function getCandidateFromStore(candidateId){
    return chatStore[candidateId]
}

function populateSideChatView(array) {
    var str = ""
    array.forEach(function(aCandidate) {

		var card = $(".conversationItem.prototype").clone().removeClass("prototype hidden")
		card.find(".user-image img").attr("src",(aCandidate["img"] || "/static/images/noimage.png"));
        card.attr("data-id",aCandidate["userId"]);
        card.find(".user-name").text(aCandidate["name"]);
        card.find(".user-designation").text(aCandidate["designation"]);

		card.attr("data-channel-name" , aCandidate["channel"])
        // card.find(".last-active-date").text(ISODateToD_M(aCandidate["lastActive"]));
		str += card[0].outerHTML
	})
    $("#conversationListing").append(str)
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

	$('.chat-div .chat-div-header').click(function() {
		$(this).find(".minusIcon").toggleClass("active")
		$('.chat-div .chat-div-content').toggleClass("show");
		//$('.chat-div .minusIcon').toggleClass("show");
	});
	getRequest(baseUrl+"/recruiter/"+recruiterId+"/chat", {}, function(res){
		if(res.status && res.status =='success'){
			populateChatView(res.data);
            populateSideChatView(res.data);
			subscribe(getArray(res.data));
            saveToStore(res.data)

            if(window.innerWidth > 1024 ){
                $("#conversationListingContainer").removeClass("hidden")
            }

            if(window.innerWidth > 768 && window.innerWidth <= 1024 ){
                $(".chat-div").removeClass("hidden")
            }
		}
	});

})

function getTimeElement(data) {
	var card = $(".timeSeperator.prototype").clone().removeClass('prototype hidden')

	if(moment(data["entry"]["time"]).format("DD MM YYYY") == moment().format("DD MM YYYY")) {
		card.text("Today");
	}
	else {
		card.text(moment(data["entry"]["time"]).format("DD MM YYYY"))
	}
	return card
}

function getMsgSentElement(data) {

    var card = $(".message.sent.prototype").clone().removeClass('prototype hidden')
    var time;
    time = moment(data["entry"]["time"]).format("DD MMMM YYYY") + " , ";
    time += moment(data["entry"]["time"]).format("hh:mm a");
    card.find(".msgContent").html(data["entry"]["msg"]).attr("title", time);
    return card
}

// function getMsgSentElement(data) {
//
// 	var card = $(".message.sent.prototype").clone().removeClass('prototype hidden')
//
// 	card.find(".msgContent").html(data["entry"]["msg"])
// 	card.find(".msgTime").text(moment(data["entry"]["time"]).format("hh:mm a"))
// 	return card
// }

// function getMsgReceivedElement(data) {
// 	var card = $(".message.received.prototype").clone().removeClass('prototype hidden')
// 	card.find(".useImg").attr("src", (data["entry"]["img"] || "/static/images/noimage.png"))
// 	card.find(".msgContent").html(data["entry"]["msg"])
// 	card.find(".msgTime").text(moment(data["entry"]["time"]).format("hh:mm a"))
// 	return card
// }

function getMsgReceivedElement(data, flag) {
    var card = $(".message.received.prototype").clone().removeClass('prototype hidden')

    var time;
    time = moment(data["entry"]["time"]).format("DD MMMM YYYY") + " , ";
    time += moment(data["entry"]["time"]).format("hh:mm a");
    card.find(".msgContent").html(data["entry"]["msg"]).attr("title", time);
    return card
}

var isShowCollapsedCandidate = 0;
var count = 0;

chatContainer.on('click','.candidate-card', function() {

	if(!($(this).hasClass("selected-sticky"))) {

		var channelName = $(this).attr("data-channel-name")
		var chatContainerBox = chatDivBox.clone().removeClass('prototype hidden');
		chatContainerBox.find(".candidate-name").text($(this).find(".candidate-name").text());
		// chatContainerBox.find(".last-active-date").text(startTime());
		chatContainerBox.find(".chat-div-header").attr("data-id",$(this).attr("data-id"));
		chatContainerBox.find(".info-buttons .infoIcon").attr("data-id",$(this).attr("data-id"));
		chatContainerBox.find(".info-buttons .minusIcon").attr("data-id",$(this).attr("data-id"));
		chatContainerBox.find(".info-buttons .closeIcon").attr("data-id",$(this).attr("data-id"));
		chatContainerBox.attr("data-id",$(this).attr("data-id"));
        var dataID = chatContainerBox.attr("data-id");
        var obj = getCandidateFromStore(dataID)
        chatContainerBox.attr("data-channel-name",channelName);
        chatContainerBox.find(".info-container img").attr("src", (obj["img"] || "/static/images/noimage.png"))
        chatContainerBox.find(".info-container .primary-content").text(obj["name"] + " works as " + obj["designation"] + " at iimjobs")

        chatContainerBox.find(".info-container .secondary-content").text(obj["name"] + " has applied to " + obj["title"] + " Current Status is "+stat[obj["status"]]+"")
		chatContainerBox.find(".chat-input").attr("data-channel-name", channelName)
		chatContainerBox.find(".chat-input").attr("data-id",$(this).attr("data-id") )
        chatContainerBox.find(".no-start").removeClass("hidden")
        chatContainerBox.find(".start").addClass("hidden")
		var that = $(this)

        if($(".chat-candidate-boxes").children().length < maxCandidateChats) {
            $(".chat-candidate-boxes").prepend(chatContainerBox);
            chatContainerBox.find(".content-footer-container").addClass("show")
            chatContainerBox.find(".chat-div-content").scrollTop(chatContainerBox.find(".chat-div-content ul").outerHeight())
            //setTimeout(function(){ chatContainerBox.find(".chat-div-content").scrollTop(chatContainerBox.find(".chat-div-content ul").outerHeight()); }, 3000)
        }
        else {
            var clonedElement = $(".candidate-collapsed-block.prototype").clone().removeClass('prototype hidden');
            $(".chat-candidate-boxes").prepend(chatContainerBox);
            chatContainerBox.find(".content-footer-container").addClass("show")
            //setTimeout(function(){ chatContainerBox.find(".chat-div-content").scrollTop(chatContainerBox.find(".chat-div-content ul").outerHeight()); }, 3000)
            var hideElement = 1+maxCandidateChats;
            var dataIdLocal = $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").attr("data-id");
            clonedElement.attr("data-id",dataIdLocal);
            clonedElement.html($(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").find(".candidate-name").text()+"<i data-id="+dataIdLocal+" class='icon-cross_icon' aria-hidden='true'></i>");
            $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").addClass("hidden");
            if($(".chat-collapsed-candidate-container").hasClass("hidden")) {
                $(".chat-collapsed-candidate-container").removeClass("hidden");
            }
            $(".chat-collapsed-candidate-container .chat-collapsed-candidate .chat-collapsed-candidate-wrapper").append(clonedElement);
        }
        reposition_chat_windows();
        that.addClass("selected-sticky");
		fetchHistory(channelName, 20 , null, null, function(status, response) {
			var str = ""
		    response["messages"].forEach(function(elem, index){
				if(index == 0 || (index > 0 && (moment(response["messages"][index - 1]["entry"]["time"]).format("DD MM YYYY") != moment(elem["entry"]["time"]).format("DD MM YYYY"))) ) {
                    var item = getTimeElement(elem)
					str+=item[0].outerHTML;
                }
                if(elem["entry"]["UUID"] == btoa(recruiterId+'--'+recruiterEmail) ) {

                    var item = getMsgSentElement(elem)
                    str+=item[0].outerHTML;
                }
                else {
                    var item = getMsgReceivedElement(elem)
                    str+=item[0].outerHTML;
                }
		    })

			$(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content ul").append(str)
            initializeTooltip()
            scrollToBottom(channelName)
		});

	}
})

$("#conversationListing").on('click','.conversationItem', function() {

	if(!($(this).hasClass("selected"))) {

		var channelName = $(this).attr("data-channel-name")
		var chatContainerBox = chatDivBox.clone().removeClass('prototype hidden');
		chatContainerBox.find(".candidate-name").text($(this).find(".user-name").text());
		// chatContainerBox.find(".last-active-date").text(startTime());
		chatContainerBox.find(".chat-div-header").attr("data-id",$(this).attr("data-id"));
		chatContainerBox.find(".info-buttons .infoIcon").attr("data-id",$(this).attr("data-id"));
		chatContainerBox.find(".info-buttons .minusIcon").attr("data-id",$(this).attr("data-id"));
		chatContainerBox.find(".info-buttons .closeIcon").attr("data-id",$(this).attr("data-id"));
		chatContainerBox.attr("data-id",$(this).attr("data-id"));
        var dataID = $(this).attr("data-id");


        var obj = getCandidateFromStore(dataID)

        chatContainerBox.attr("data-channel-name",channelName);
        chatContainerBox.find(".info-container img").attr("src", (obj["img"] || "/static/images/noimage.png"))
        chatContainerBox.find(".info-container .primary-content").text(obj["name"] + " works as " + obj["designation"] + " at iimjobs")

        chatContainerBox.find(".info-container .secondary-content").text(obj["name"] + " has applied to " + obj["title"] + " Current Status is "+stat[obj["status"]]+"")
		chatContainerBox.find(".chat-input").attr("data-channel-name", channelName)
		chatContainerBox.find(".chat-input").attr("data-id",$(this).attr("data-id") )
        chatContainerBox.find(".no-start").removeClass("hidden")
        chatContainerBox.find(".start").addClass("hidden")
		var that = $(this)

        if($(".chat-candidate-boxes").children().length < maxCandidateChats) {
            $(".chat-candidate-boxes").prepend(chatContainerBox);
            chatContainerBox.find(".content-footer-container").addClass("show")
            chatContainerBox.find(".chat-div-content").scrollTop(chatContainerBox.find(".chat-div-content ul").outerHeight())
            //setTimeout(function(){ chatContainerBox.find(".chat-div-content").scrollTop(chatContainerBox.find(".chat-div-content ul").outerHeight()); }, 3000)
        }
        else {
            var clonedElement = $(".candidate-collapsed-block.prototype").clone().removeClass('prototype hidden');
            $(".chat-candidate-boxes").prepend(chatContainerBox);
            chatContainerBox.find(".content-footer-container").addClass("show")
            //setTimeout(function(){ chatContainerBox.find(".chat-div-content").scrollTop(chatContainerBox.find(".chat-div-content ul").outerHeight()); }, 3000)
            var hideElement = 1+maxCandidateChats;
            var dataIdLocal = $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").attr("data-id");
            clonedElement.attr("data-id",dataIdLocal);
            clonedElement.html($(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").find(".candidate-name").text()+"<i data-id="+dataIdLocal+" class='icon-cross_icon' aria-hidden='true'></i>");
            $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").addClass("hidden");
            if($(".chat-collapsed-candidate-container").hasClass("hidden")) {
                $(".chat-collapsed-candidate-container").removeClass("hidden");
            }
            $(".chat-collapsed-candidate-container .chat-collapsed-candidate .chat-collapsed-candidate-wrapper").append(clonedElement);
        }
        reposition_chat_windows();
        that.addClass("selected");
		fetchHistory(channelName, 20 , null, null, function(status, response) {
			var str = ""
		    response["messages"].forEach(function(elem, index){
				if(index == 0 || (index > 0 && (moment(response["messages"][index - 1]["entry"]["time"]).format("DD MM YYYY") != moment(elem["entry"]["time"]).format("DD MM YYYY"))) ) {
                    var item = getTimeElement(elem)
					str+=item[0].outerHTML;
                }
                if(elem["entry"]["UUID"] == btoa(recruiterId+'--'+recruiterEmail) ) {

                    var item = getMsgSentElement(elem)
                    str+=item[0].outerHTML;
                }
                else {
                    var item = getMsgReceivedElement(elem)
                    str+=item[0].outerHTML;
                }
		    })

			$(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content ul").append(str)
            initializeTooltip()
            scrollToBottom(channelName)
		});

	}
})



$("#chat-collapsed-container").on('click',".chat-collapsed-candidate-container .candidate-collapsed-block i", function(event) {
	event.stopPropagation();
	var dataId = $(this).attr("data-id");

	$("#chat-collapsed-container .candidate-collapsed-block[data-id="+dataId+"]").remove();
    $('.chat-div-candidate[data-id='+dataId+']').remove();
	chatContainer.find(".candidate-card[data-id="+dataId+"]").removeClass("selected-sticky");
    $("#conversationListing").find(".conversationItem[data-id="+dataId+"]").removeClass("selected")
	if($(".chat-collapsed-candidate-container .chat-collapsed-candidate-wrapper").children().length == 0) {
		$(".chat-collapsed-candidate-container").addClass("hidden");
	}
})

$("#chat-collapsed-container").on('click',".chat-collapsed-candidate-container .candidate-collapsed-block", function(event) {

	var dataId = $(this).attr("data-id");
    $(this).remove();
    var clonedElement = $(".candidate-collapsed-block.prototype").clone().removeClass('prototype hidden');
    var hideElement = maxCandidateChats;
    var elem = $(".chat-candidate-boxes .chat-div-candidate:not(.hidden)").get(maxCandidateChats-1);

    var dataIdLocal = $(elem).attr("data-id");
    clonedElement.attr("data-id",dataIdLocal);
    clonedElement.html($(elem).find(".candidate-name").text()+"<i data-id="+dataIdLocal+" class='icon-cross_icon' aria-hidden='true'></i>");
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
	$('.chat-div-candidate .chat-div-header[data-id='+dataId+'] .minusIcon').toggleClass("active")
})

$(".chat-candidate-boxes").on('click','.chat-div-candidate .info-buttons .closeIcon', function(event) {
	event.stopPropagation();
	var dataId = $(this).attr("data-id");
	hideElement = 1 + maxCandidateChats;
	if($(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").hasClass("hidden")) {
		$(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").removeClass("hidden");
		var collapsedDataId = $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").attr("data-id");

		$(".chat-collapsed-candidate-container .candidate-collapsed-block[data-id="+collapsedDataId+"]").remove();
		if($(".chat-collapsed-candidate-container .chat-collapsed-candidate-wrapper").children().length == 0) {
			$(".chat-collapsed-candidate-container").addClass("hidden");
		}
	}
	$('.chat-div-candidate[data-id='+dataId+']').remove();
	chatContainer.find(".candidate-card[data-id="+dataId+"]").removeClass("selected-sticky");
    $("#conversationListing").find(".conversationItem[data-id="+dataId+"]").removeClass("selected")
	reposition_chat_windows();
})

$(".chat-candidate-boxes").on('click','.chat-div-candidate .info-buttons .infoIcon', function(event) {
	var dataId = $(this).attr("data-id");
	if(!($(".chat-candidate-boxes .chat-div-candidate[data-id="+dataId+"] .content-footer-container").hasClass("show"))) {
		return
	}
	event.stopPropagation();
    $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataId+"] .content-footer-container .info-container").toggleClass("hidden")
})

var displayAMessage = function(event) {
    var key = event.which;
	var channelName = $(this).attr("data-channel-name");
	var dataID = $(this).attr("data-id");
	var message = $(this).val()
	var that = $(this)
    if(key == 13) {
		publish({
            UUID:uuid || btoa(recruiterId+'--'+recruiterEmail),
            deviceID: getCookie("sessID"),
            time: Date.now(),
            usr: recruiterId,
            name: profile["name"],
            tt:1,
            msg: message,
            img: profile.img_link,
            type: 1
        }, channelName, function(m){

			var elem = {}
			elem.entry = {}
	        elem.entry.msg = message;
	        elem.entry.time = parseInt(moment().format('x'))
	        elem.entry.img = profile.img_link

			var item = getMsgSentElement(elem)
			$(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content ul").append(item[0].outerHTML)

            initializeTooltip()
            that.val('');
            scrollToBottom(channelName)
        })
    }
}

function receiveMessage(m) {

    var msg = m.message
	if( msg["deviceID"] == getCookie("sessID") && msg["UUID"] == (btoa(recruiterId+'--'+recruiterEmail)) ){
		return
	}
    debugger
	var elem = {}
	elem.entry = {}
	elem.entry.msg = msg.msg;
	elem.entry.time = msg.time;
	elem.entry.img = msg.img;

    openChat(m.channel)

	scrollToBottom(m.channel)
}

function scrollToBottom(channelName) {
    $(".chat-candidate-boxes .chat-div-candidate[data-channel-name="+channelName+"] .content-footer-container .chat-div-content").scrollTop(jQuery(".chat-candidate-boxes .chat-div-candidate[data-channel-name="+channelName+"] .content-footer-container .chat-div-content ul").outerHeight());
}

function openChat(channelName) {
    if(window.innerWidth < 768) {
        return
    }
    if($(".chat-candidate-boxes .chat-div-candidate[data-channel-name="+channelName+"]").length){
        var item = getMsgReceivedElement(elem)
        $(".chat-candidate-boxes .chat-div-candidate[data-channel-name="+channelName+"] .content-footer-container .chat-div-content ul").append(item[0].outerHTML)
        return
    }
    else {

    }
    if(!($(this).hasClass("selected"))) {

		var channelName = $(this).attr("data-channel-name")
		var chatContainerBox = chatDivBox.clone().removeClass('prototype hidden');
		chatContainerBox.find(".candidate-name").text($(this).find(".candidate-name").text());
		// chatContainerBox.find(".last-active-date").text(startTime());
		chatContainerBox.find(".chat-div-header").attr("data-id",$(this).attr("data-id"));
		chatContainerBox.find(".info-buttons .infoIcon").attr("data-id",$(this).attr("data-id"));
		chatContainerBox.find(".info-buttons .minusIcon").attr("data-id",$(this).attr("data-id"));
		chatContainerBox.find(".info-buttons .closeIcon").attr("data-id",$(this).attr("data-id"));
		chatContainerBox.attr("data-id",$(this).attr("data-id"));
        var dataID = chatContainerBox.attr("data-id");
        var obj = getCandidateFromStore(dataID)
        chatContainerBox.attr("data-channel-name",channelName);
        chatContainerBox.find(".info-container img").attr("src", (obj["img"] || "/static/images/noimage.png"))
        chatContainerBox.find(".info-container .primary-content").text(obj["name"] + " works as " + obj["designation"] + " at iimjobs")

        chatContainerBox.find(".info-container .secondary-content").text(obj["name"] + " has applied to " + obj["title"] + " Current Status is "+stat[obj["status"]]+"")
		chatContainerBox.find(".chat-input").attr("data-channel-name", channelName)
		chatContainerBox.find(".chat-input").attr("data-id",$(this).attr("data-id") )
        chatContainerBox.find(".no-start").removeClass("hidden")
        chatContainerBox.find(".start").addClass("hidden")
		var that = $(this)

        if($(".chat-candidate-boxes").children().length < maxCandidateChats) {
            $(".chat-candidate-boxes").prepend(chatContainerBox);
            chatContainerBox.find(".content-footer-container").addClass("show")
            chatContainerBox.find(".chat-div-content").scrollTop(chatContainerBox.find(".chat-div-content ul").outerHeight())
            //setTimeout(function(){ chatContainerBox.find(".chat-div-content").scrollTop(chatContainerBox.find(".chat-div-content ul").outerHeight()); }, 3000)
        }
        else {
            var clonedElement = $(".candidate-collapsed-block.prototype").clone().removeClass('prototype hidden');
            $(".chat-candidate-boxes").prepend(chatContainerBox);
            chatContainerBox.find(".content-footer-container").addClass("show")
            //setTimeout(function(){ chatContainerBox.find(".chat-div-content").scrollTop(chatContainerBox.find(".chat-div-content ul").outerHeight()); }, 3000)
            var hideElement = 1+maxCandidateChats;
            var dataIdLocal = $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").attr("data-id");
            clonedElement.attr("data-id",dataIdLocal);
            clonedElement.html($(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").find(".candidate-name").text()+"<i data-id="+dataIdLocal+" class='icon-cross_icon' aria-hidden='true'></i>");
            $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").addClass("hidden");
            if($(".chat-collapsed-candidate-container").hasClass("hidden")) {
                $(".chat-collapsed-candidate-container").removeClass("hidden");
            }
            $(".chat-collapsed-candidate-container .chat-collapsed-candidate .chat-collapsed-candidate-wrapper").append(clonedElement);
        }
        reposition_chat_windows();
        that.addClass("selected");
		fetchHistory(channelName, 20 , null, null, function(status, response) {
			var str = ""
		    response["messages"].forEach(function(elem, index){
				if(index == 0 || (index > 0 && (moment(response["messages"][index - 1]["entry"]["time"]).format("DD MM YYYY") != moment(elem["entry"]["time"]).format("DD MM YYYY"))) ) {
                    var item = getTimeElement(elem)
					str+=item[0].outerHTML;
                }
                if(elem["entry"]["UUID"] == btoa(recruiterId+'--'+recruiterEmail) ) {

                    var item = getMsgSentElement(elem)
                    str+=item[0].outerHTML;
                }
                else {
                    var item = getMsgReceivedElement(elem)
                    str+=item[0].outerHTML;
                }
		    })

			$(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content ul").append(str)
            initializeTooltip()
            scrollToBottom(channelName)
		});

	}
}

function openChat() {
    if(!($(this).hasClass("selected"))) {

		var channelName = $(this).attr("data-channel-name")
		var chatContainerBox = chatDivBox.clone().removeClass('prototype hidden');
		chatContainerBox.find(".candidate-name").text($(this).find(".candidate-name").text());
		// chatContainerBox.find(".last-active-date").text(startTime());
		chatContainerBox.find(".chat-div-header").attr("data-id",$(this).attr("data-id"));
		chatContainerBox.find(".info-buttons .infoIcon").attr("data-id",$(this).attr("data-id"));
		chatContainerBox.find(".info-buttons .minusIcon").attr("data-id",$(this).attr("data-id"));
		chatContainerBox.find(".info-buttons .closeIcon").attr("data-id",$(this).attr("data-id"));
		chatContainerBox.attr("data-id",$(this).attr("data-id"));
        var dataID = chatContainerBox.attr("data-id");
        var obj = getCandidateFromStore(dataID)
        chatContainerBox.attr("data-channel-name",channelName);
        chatContainerBox.find(".info-container img").attr("src", (obj["img"] || "/static/images/noimage.png"))
        chatContainerBox.find(".info-container .primary-content").text(obj["name"] + " works as " + obj["designation"] + " at iimjobs")

        chatContainerBox.find(".info-container .secondary-content").text(obj["name"] + " has applied to " + obj["title"] + " Current Status is "+stat[obj["status"]]+"")
		chatContainerBox.find(".chat-input").attr("data-channel-name", channelName)
		chatContainerBox.find(".chat-input").attr("data-id",$(this).attr("data-id") )
        chatContainerBox.find(".no-start").removeClass("hidden")
        chatContainerBox.find(".start").addClass("hidden")
		var that = $(this)

        if($(".chat-candidate-boxes").children().length < maxCandidateChats) {
            $(".chat-candidate-boxes").prepend(chatContainerBox);
            chatContainerBox.find(".content-footer-container").addClass("show")
            chatContainerBox.find(".chat-div-content").scrollTop(chatContainerBox.find(".chat-div-content ul").outerHeight())
            //setTimeout(function(){ chatContainerBox.find(".chat-div-content").scrollTop(chatContainerBox.find(".chat-div-content ul").outerHeight()); }, 3000)
        }
        else {
            var clonedElement = $(".candidate-collapsed-block.prototype").clone().removeClass('prototype hidden');
            $(".chat-candidate-boxes").prepend(chatContainerBox);
            chatContainerBox.find(".content-footer-container").addClass("show")
            //setTimeout(function(){ chatContainerBox.find(".chat-div-content").scrollTop(chatContainerBox.find(".chat-div-content ul").outerHeight()); }, 3000)
            var hideElement = 1+maxCandidateChats;
            var dataIdLocal = $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").attr("data-id");
            clonedElement.attr("data-id",dataIdLocal);
            clonedElement.html($(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").find(".candidate-name").text()+"<i data-id="+dataIdLocal+" class='icon-cross_icon' aria-hidden='true'></i>");
            $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").addClass("hidden");
            if($(".chat-collapsed-candidate-container").hasClass("hidden")) {
                $(".chat-collapsed-candidate-container").removeClass("hidden");
            }
            $(".chat-collapsed-candidate-container .chat-collapsed-candidate .chat-collapsed-candidate-wrapper").append(clonedElement);
        }
        reposition_chat_windows();
        that.addClass("selected");
		fetchHistory(channelName, 20 , null, null, function(status, response) {
			var str = ""
		    response["messages"].forEach(function(elem, index){
				if(index == 0 || (index > 0 && (moment(response["messages"][index - 1]["entry"]["time"]).format("DD MM YYYY") != moment(elem["entry"]["time"]).format("DD MM YYYY"))) ) {
                    var item = getTimeElement(elem)
					str+=item[0].outerHTML;
                }
                if(elem["entry"]["UUID"] == btoa(recruiterId+'--'+recruiterEmail) ) {

                    var item = getMsgSentElement(elem)
                    str+=item[0].outerHTML;
                }
                else {
                    var item = getMsgReceivedElement(elem)
                    str+=item[0].outerHTML;
                }
		    })

			$(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content ul").append(str)
            initializeTooltip()
            scrollToBottom(channelName)
		});
	}
}

$(".chat-candidate-boxes").on('keypress','.chat-input', displayAMessage);

function receivePresence(p) {

    if(p["action"] == "join" && p["occupancy"] >= 2 && p["uuid"] != getUUID()) {
        $(".chat-div .chat-div-content .candidate-card[data-channel-name="+p.channel+"] .candidate-status").removeClass("hidden")
        $(".chat-candidate-boxes .chat-div-content[data-channel-name="+p.channel+"] .last-active-date").text("Active Now")
    }
    else if (p["action"] == "leave" && p["occupancy"] < 2 && p["uuid"] != getUUID()) {
        $(".chat-div .chat-div-content .candidate-card[data-channel-name="+p.channel+"] .candidate-status").addClass("hidden")

        $(".chat-candidate-boxes .chat-div-content[data-channel-name="+p.channel+"] .last-active-date").text("Today")

    }
}

function cloneStickyChat(array,recruiterId, jobId, applicationId) {
	array[0]["userId"] = array[0]["userID"]
    array[0]["jobs"].forEach(function(elem){
        if(elem["is_current"] == 1) {
            array[0]["designation"] == elem["designation"]
        }
    })
	if(!(chatContainer.find('.candidate-card[data-channel-name="iimjobs--r'+recruiterId+'-j'+array[0]["userID"]+'"]').length)) {
        postRequest(baseUrl+"/recruiter/"+recruiterId+"/job/"+jobId+"/application/"+applicationId+"/action/chat", null, {}, function(res, status, xhr){
    		if(res.status && res.status =='success'){
                debugger
                if(window.innerWidth <= 768) {
                    return window.location.href = '/my-chat?candidateId='+array[0]["userID"]+''
                }
                array[0]["channel"] = res.data
                populateChatView(array)
        		var channelName = res.data
        		var chatContainerBox = chatDivBox.clone().removeClass('prototype hidden');
        		chatContainerBox.find(".candidate-name").text(array[0]["name"]);
        		// chatContainerBox.find(".last-active-date").text(startTime());
        		chatContainerBox.find(".chat-div-header").attr("data-id",array[0]["userID"]);
        		chatContainerBox.find(".info-buttons .infoIcon").attr("data-id",array[0]["userID"]);
        		chatContainerBox.find(".info-buttons .minusIcon").attr("data-id",array[0]["userID"]);
        		chatContainerBox.find(".info-buttons .closeIcon").attr("data-id",array[0]["userID"]);
        		chatContainerBox.attr("data-id",array[0]["userID"]);
        		chatContainerBox.find(".chat-input").attr("data-channel-name", channelName)
        		chatContainerBox.find(".chat-input").attr("data-id",array[0]["userID"] )
                chatContainerBox.find(".no-start").addClass("hidden")
                chatContainerBox.find(".start").removeClass("hidden")
        		var dataID = chatContainerBox.attr("data-id");
                if($(".chat-candidate-boxes").children().length < maxCandidateChats) {
                    $(".chat-candidate-boxes").prepend(chatContainerBox);
                    chatContainerBox.find(".content-footer-container").addClass("show")
                    chatContainerBox.find(".chat-div-content").scrollTop(chatContainerBox.find(".chat-div-content ul").outerHeight())
                    //setTimeout(function(){ chatContainerBox.find(".chat-div-content").scrollTop(chatContainerBox.find(".chat-div-content ul").outerHeight()); }, 3000)
                }
                else {
                    var clonedElement = $(".candidate-collapsed-block.prototype").clone().removeClass('prototype hidden');
                    $(".chat-candidate-boxes").prepend(chatContainerBox);
                    chatContainerBox.find(".content-footer-container").addClass("show")
                    //setTimeout(function(){ chatContainerBox.find(".chat-div-content").scrollTop(chatContainerBox.find(".chat-div-content ul").outerHeight()); }, 3000)
                    var hideElement = 1+maxCandidateChats;
                    var dataIdLocal = $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").attr("data-id");
                    clonedElement.attr("data-id",dataIdLocal);
                    clonedElement.html($(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").find(".candidate-name").text()+"<i data-id="+dataIdLocal+" class='icon-cross_icon' aria-hidden='true'></i>");
                    $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").addClass("hidden");
                    if($(".chat-collapsed-candidate-container").hasClass("hidden")) {
                        $(".chat-collapsed-candidate-container").removeClass("hidden");
                    }
                    $(".chat-collapsed-candidate-container .chat-collapsed-candidate .chat-collapsed-candidate-wrapper").append(clonedElement);
                }
                reposition_chat_windows();

                chatContainer.find('.candidate-card[data-id='+array[0]["userID"]+']').addClass("selected-sticky");
    		}
        	}, function(res){

        	});
        }

    else {
        debugger
        if(window.innerWidth <= 768) {
            return window.location.href = '/my-chat?candidateId='+array[0]["userID"]+''
        }
        var channelName = "iimjobs--r"+recruiterId+"-j"+array[0]["userID"]+"";
        var chatContainerBox = chatDivBox.clone().removeClass('prototype hidden');
        chatContainerBox.find(".candidate-name").text(array[0]["name"]);
        // chatContainerBox.find(".last-active-date").text(startTime());
        chatContainerBox.find(".chat-div-header").attr("data-id",array[0]["userID"]);
        chatContainerBox.find(".info-buttons .infoIcon").attr("data-id",array[0]["userID"]);
        chatContainerBox.find(".info-buttons .minusIcon").attr("data-id",array[0]["userID"]);
        chatContainerBox.find(".info-buttons .closeIcon").attr("data-id",array[0]["userID"]);
        chatContainerBox.attr("data-id",array[0]["userID"]);
        chatContainerBox.find(".chat-input").attr("data-channel-name", channelName)
        chatContainerBox.find(".chat-input").attr("data-id",array[0]["userID"] )
        var dataID = chatContainerBox.attr("data-id");

        fetchHistory(channelName, 20 , function(status, response) {
        	var str = ""
            response["messages"].forEach(function(elem, index){
        		if(index == 0 || (index > 0 && (moment(response["messages"][index - 1]["entry"]["time"]).format("DD MM YYYY") != moment(elem["entry"]["time"]).format("DD MM YYYY"))) ) {
                    var item = getTimeElement(elem)
        			str+=item[0].outerHTML;
                }
                if(elem["entry"]["UUID"] == btoa(recruiterId+'--'+recruiterEmail) ) {

                    var item = getMsgSentElement(elem)
                    str+=item[0].outerHTML;
                }
                else {
                    var item = getMsgReceivedElement(elem)
                    str+=item[0].outerHTML;
                }
            })
        	$(".chat-candidate-boxes .chat-div-candidate[data-id="+array[0]["userID"]+"] .content-footer-container .chat-div-content ul").append(str)
            initializeTooltip()
            scrollToBottom(channelName)
        });
        if($(".chat-candidate-boxes").children().length < maxCandidateChats) {
            $(".chat-candidate-boxes").prepend(chatContainerBox);
            chatContainerBox.find(".content-footer-container").addClass("show")
            chatContainerBox.find(".chat-div-content").scrollTop(chatContainerBox.find(".chat-div-content ul").outerHeight())
            //setTimeout(function(){ chatContainerBox.find(".chat-div-content").scrollTop(chatContainerBox.find(".chat-div-content ul").outerHeight()); }, 3000)
        }
        else {
            var clonedElement = $(".candidate-collapsed-block.prototype").clone().removeClass('prototype hidden');
            $(".chat-candidate-boxes").prepend(chatContainerBox);
            chatContainerBox.find(".content-footer-container").addClass("show")
            //setTimeout(function(){ chatContainerBox.find(".chat-div-content").scrollTop(chatContainerBox.find(".chat-div-content ul").outerHeight()); }, 3000)
            var hideElement = 1+maxCandidateChats;
            var dataIdLocal = $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").attr("data-id");
            clonedElement.attr("data-id",dataIdLocal);
            clonedElement.html($(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").find(".candidate-name").text()+"<i data-id="+dataIdLocal+" class='icon-cross_icon' aria-hidden='true'></i>");
            $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").addClass("hidden");
            if($(".chat-collapsed-candidate-container").hasClass("hidden")) {
                $(".chat-collapsed-candidate-container").removeClass("hidden");
            }
            $(".chat-collapsed-candidate-container .chat-collapsed-candidate .chat-collapsed-candidate-wrapper").append(clonedElement);
        }
        reposition_chat_windows();
        chatContainer.find('.candidate-card[data-id='+array[0]["userID"]+']').addClass("selected-sticky");
    }
}

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

var ticker;
$(".chat-candidate-boxes .chat-div-candidate .content-footer-container .chat-div-content").scroll(function(){

    clearTimeout(ticker);
    ticker = setTimeout(checkScrollEnd,100);
})

function checkScrollEnd() {

    if($(".chat-candidate-boxes .chat-div-candidate .content-footer-container .chat-div-content").scrollTop() < 5) {
        return console.log($(this))
        if(globalParameters.startTimeToken == 0) {
            return
        }
        chatEngine.fetchHistory(globalParameters.channelName , globalParameters.messageNumber ,globalParameters.startTimeToken, null, onFetchHistory);
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

function initializeTooltip() {
     $(".tooltip").not(".prototype .tooltip").tooltipster({
        animation: 'fade',
        delay: 0,
        side:['bottom'],
        theme: 'tooltipster-borderless'
    })
}
