var recruiterID = localStorage.id;
var userProfile = $(".user_profile_side");
var navBar = $(".navbar");
var chatContainer = $(".chat-div");
var chatDivBox = $(".chat-div-candidate.prototype");
var candidatesWrapper = $(".candidate-card.prototype");


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

		$('.chat-div .chat-div-content').toggleClass("show");
		//$('.chat-div .minus-icon').toggleClass("show");
	});
	populateChatView(candidates);


})



var isShowCollapsedCandidate = 0;
var count = 0;

chatContainer.on('click','.candidate-card', function() {
	console.log("hi");
	if(!($(this).hasClass("selected"))) {
		var chatContainerBox = chatDivBox.clone().removeClass('prototype hidden');
		chatContainerBox.find(".candidate-name").text($(this).find(".candidate-name").text());
		// chatContainerBox.find(".last-active-date").text(startTime());
		chatContainerBox.find(".chat-div-header").attr("data-id",$(this).attr("data-id"));
		chatContainerBox.find(".info-buttons .info-icon").attr("data-id",$(this).attr("data-id"));
		chatContainerBox.find(".info-buttons .minus-icon").attr("data-id",$(this).attr("data-id"));
		chatContainerBox.find(".info-buttons .close-icon").attr("data-id",$(this).attr("data-id"));
		chatContainerBox.attr("data-id",$(this).attr("data-id"));
		var dataID = chatContainerBox.attr("data-id");
		// fetchHistory(chatContainerBox.find(".candidate-name").text(), 20 , function(status, response) {
		//     console.log(response);
		//     response["messages"].forEach(function(elem, index){
		//         var postedTime = ISODateToTime(elem["entry"]["time"]);
		//         elem["entry"]["time"] = ISODateToD_M_Y(elem["entry"]["time"]);
        //
		//         if(index == 0) {
		// 			$(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content").append("<div class='date-block '><div class='date'>"+elem["entry"]["time"]+"</div></div>");
        //
		//         }
		//         if (index > 0 && (response["messages"][index - 1]["entry"]["time"] != elem["entry"]["time"])) {
		//              	$(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content").append("<div class='date-block '><div class='date'>"+elem["entry"]["time"]+"</div></div>");
		//         }
		//          $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content").append("<div class='message-container left'><div class='message-received'>"+elem["entry"]["msg"]+"<div class='caret'></div><span class='current-time'>"+postedTime+"</span></div></div>")
		//     })
		// });
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
		card.find(".candidate-image img").attr("src",recruiter["img_url"]).removeClass("animated-background");
        card.attr("data-id",aCandidate["id"]);
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





})
