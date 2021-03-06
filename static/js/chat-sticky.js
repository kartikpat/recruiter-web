
$(document).ready(function(){
    var settings={};
    settings.chatCollapsedContainer=".chat-collapsed-candidate-container";
    settings.chatCollapsedCandidate=".chat-collapsed-candidate";
    settings.closeChatCollapsedWrapper='.chat-collapsed-candidate-wrapper';
    settings.conversationListingContainer='#conversationListingContainer';
    settings.chatDiv='.chat-div';
    settings.chatDivHeader=".chat-div-header";
    settings.minusIcon=".info-buttons .minusIcon";
    settings.chatDivContnet=".chat-div-content";
    settings.messageSentPrototype=".message.sent.prototype";
    settings.messageRecievedPrototype=".message.received.prototype";
    settings.messageContent=".msgContent";
    settings.footerContainer=".content-footer-container";
    settings.chatCandidateboxes=".chat-candidate-boxes";    
    settings.conversationListing="#conversationListing";
    settings.candidateName=".candidate-name";
    settings.infoIcon=".info-buttons .infoIcon";
    settings.closeIcon=".info-buttons .closeIcon";
    settings.chatInput=".chat-input";
    settings.infoImg=".info-container img";
    settings.lastActive=".lastActiveDate";
    settings.chatCollapsedContainerId="#chat-collapsed-container";
    settings.userName=".user-name";
    settings.userImage=".user-image img";
    settings.userDesignation=".user-designation";
   
    if ($(document).width() < 1000) {
        maxCandidateChats = 1
    } else {
        if ($(document).width() < 1450) {

            maxCandidateChats = 2
        } else {

            maxCandidateChats = 3
        }
    }


    
    var ticker;
    var isShowCollapsedCandidate = 0;
    var count = 0;
    var chatContainer = $(".chat-div");
    var chatDivBox = $(".chat-div-candidate.prototype");
    var candidatesWrapper = $(".candidate-card.prototype");
    var recruiterName = profile.name
    var recruiterEmail = profile.email
    var messageNumber = 20;
    
    var stat = {
        "": "Unread",
        1: "Shortlisted",
        2: "Rejected",
        3: "Saved",
        4: "Reviewed",
        5: "Reviewed"
    };

    var chatStore= {}


    onClickStickyChat();
    onClickSidebarChat();
    closeCollapsedSidebarChat();
    closeCollapsedStickyChat();
    onClickCandNameStopEvent();
    minimizeSideBarChat();
    onClickCloseSidebarChat();
    onClickInfoIcon();
    onFocusChatMessage();
    
	$(settings.chatDivHeader).click(function() {
		$(this).find(".minusIcon").toggleClass("active")
		$(settings.chatDivContnet).toggleClass("show");
    });

    $(".chat-collapsed-candidate-container .chat-collapsed-candidate").click(function(){
        $(this).find(".chat-collapsed-candidate-wrapper").toggleClass("hidden")
    })


	getRequest(baseUrl+"/recruiter/"+recruiterId+"/chat", {}, function(res){
		if(res.status && res.status =='success'){
			populateChatView(res.data);
            populateSideChatView(res.data);
			subscribe(getArray(res.data));
            saveToStore(res.data)

            if(window.innerWidth > 1024 ){
                $(settings.conversationListingContainer).removeClass("hidden")
            }

            if(window.innerWidth > 768 && window.innerWidth <= 1024 ){
                $(".chat-div").removeClass("hidden")
            }
		}
	});

    function saveToStore(dataArray){
        dataArray.forEach(function(anObj) {
            chatStore[anObj["userId"]] = anObj;
        })
    }
    
    function getDeviceId() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
        for (var i = 0; i < 20; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
    
        return "web"+text+Date.now();
    }
  
    var deviceId = getDeviceId();
   
    function getCandidateFromStore(candidateId){
        return chatStore[candidateId]
    }
    
    function populateSideChatView(array) {
        var str = ""
        array.forEach(function(aCandidate) {
            var card = $(".conversationItem.prototype").clone().removeClass("prototype hidden")
            card.find(settings.userImage).attr("src",(aCandidate["img"] || "/static/images/noimage.png"));
            card.attr("data-id",aCandidate["userId"]);
            card.find(settings.userName).text(aCandidate["name"]);
            card.find(settings.userDesignation).text(aCandidate["designation"]);
    
            card.attr("data-channel-name" , aCandidate["channel"])
    
            str += card[0].outerHTML
        })
        $(settings.conversationListing).append(str)
    }
    

    function getTimeElement(data) {
        var card = $(".timeSeperator.prototype").clone().removeClass('prototype hidden')

        if(moment(data["entry"]["time"]).format("DD MM YYYY") == moment().format("DD MM YYYY")) {
            card.text("Today");
        }
        else {
            card.text(moment(data["entry"]["time"]).format("DD MMMM YYYY"))
        }
        return card
    }

    function getMsgSentElement(data) {

        var card = $(settings.messageSentPrototype).clone().removeClass('prototype hidden')
        var time;
        time = moment(data["entry"]["time"]).format("DD MMMM YYYY") + " , ";
        time += moment(data["entry"]["time"]).format("hh:mm a");
        card.find(settings.messageContent).html(data["entry"]["msg"]).attr("title", time);
        // card.find('.msgContent').append("<span class='icon-container'><i class='icon-history-button'></i></span>")
        return card
    }


    function getMsgReceivedElement(data) {
        var card = $(settings.messageRecievedPrototype).clone().removeClass('prototype hidden')

        var time;
        time = moment(data["entry"]["time"]).format("DD MMMM YYYY") + " , ";
        time += moment(data["entry"]["time"]).format("hh:mm a");
        card.find(settings.messageContent).html(data["entry"]["msg"]).attr("title", time);
        return card
    }


    function textAreaAdjust(o) {
        if(o.scrollHeight == 35 || o.scrollHeight > 75) {
            return
        }

        o.style.height = (o.scrollHeight + 2) + "px";

        $(o).closest(settings.footerContainer).find(settings.chatDivContnet).height(293 - (o.scrollHeight));
    }

    function onClickStickyChat(){
        chatContainer.on('click','.candidate-card', function() {
            var eventObj = {
                event_category: eventMap["viewChatCardClick"]["cat"],
                event_label: 'origin='+origin+',recId='+recruiterId+''
            }
            sendEvent(eventMap["viewChatCardClick"]["event"], eventObj)
            if(!($(this).hasClass("selected-sticky"))) {
    
                var channelName = $(this).attr("data-channel-name")
                var chatContainerBox = chatDivBox.clone().removeClass('prototype hidden');
                chatContainerBox.find(settings.candidateName).text($(this).find(settings.candidateName).text());
                chatContainerBox.find(settings.candidateName).attr("href","/candidate/"+$(this).attr("data-id")+"/profile");
                // chatContainerBox.find(".last-active-date").text(startTime());
                chatContainerBox.find(settings.chatDivHeader).attr("data-id",$(this).attr("data-id"));
                chatContainerBox.find(settings.infoIcon).attr("data-id",$(this).attr("data-id"));
                chatContainerBox.find(settings.minusIcon).attr("data-id",$(this).attr("data-id"));
                chatContainerBox.find(settings.closeIcon).attr("data-id",$(this).attr("data-id"));
                chatContainerBox.attr("data-id",$(this).attr("data-id"));
                var dataID = chatContainerBox.attr("data-id");
                var obj = getCandidateFromStore(dataID)
                chatContainerBox.attr("data-channel-name",channelName);
                chatContainerBox.find(settings.infoImg).attr("src", (obj["img"] || "/static/images/noimage.png"))
                if(obj["lastActive"]) {
                    chatContainerBox.find(settings.lastActive).text(moment(obj["lastActive"]).format("DD-MM-YYYY")).removeClass("hidden")
                }
                chatContainerBox.find(".info-container .primary-content").text(obj["name"] + " works as " + obj["designation"] + " at " + obj["organization"])
                if(obj["title"] && obj["status"]) {
                    chatContainerBox.find(".info-container .secondary-content").text(obj["name"] + " has applied to " + obj["title"] + " Current Status is "+stat[obj["status"]]+"").removeClass("hidden")
                }
                chatContainerBox.find(settings.chatInput).attr("data-channel-name", channelName)
                chatContainerBox.find(settings.chatInput).attr("data-id",$(this).attr("data-id") )
                chatContainerBox.find(settings.chatInput).on("keydown", function(e) {
                    if (e.which == 13) {
                        e.preventDefault();
                        displayAMessage(this)
                    } else if (e.which == 13 && !e.shiftKey) {
                        displayAMessage(this)
                    } else if (e.which == 13 && e.shiftKey) {
                        textAreaAdjust(this);
                    } else {
                        textAreaAdjust(this);
                    }
    
                });
    
                chatContainerBox.find(".no-start").removeClass("hidden")
                chatContainerBox.find(".start").addClass("hidden")
                var that = $(this)
    
                if($(settings.chatCandidateboxes).children().length < maxCandidateChats) {
                    $(settings.chatCandidateboxes).prepend(chatContainerBox);
                    chatContainerBox.find(settings.footerContainer).addClass("show")
                    chatContainerBox.find(settings.chatDivContnet).scroll(function(){
                        var _that = this;
                        clearTimeout(ticker);
                        ticker = setTimeout(function(){
                            checkScrollEnd(_that)
                        },100);
                    })
    
                }
                else {
                    var clonedElement = $(".candidate-collapsed-block.prototype").clone().removeClass('prototype hidden');
                    $(settings.chatCandidateboxes).prepend(chatContainerBox);
                    chatContainerBox.find(settings.footerContainer).addClass("show")
    
                    var hideElement = 1+maxCandidateChats;
                    var dataIdLocal = $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").attr("data-id");
                    clonedElement.attr("data-id",dataIdLocal);
                    clonedElement.html($(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").find(settings.candidateName).text()+"<i data-id="+dataIdLocal+" class='icon-cross_icon' aria-hidden='true'></i>");
                    $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").addClass("hidden");
                    if($(settings.chatCollapsedContainer).hasClass("hidden")) {
                        $(settings.chatCollapsedContainer).removeClass("hidden");
                    }
                    $(".chat-collapsed-candidate-container .chat-collapsed-candidate .chat-collapsed-candidate-wrapper").append(clonedElement);
                }
                reposition_chat_windows();
                that.addClass("selected-sticky");
                fetchHistory(channelName, messageNumber , null, null, function(status, response) {
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
    
                    $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content ul").prepend(str)
                    $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content").attr("data-startTime", response.startTimeToken )
                    $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content").attr("data-endTime", response.endTimeToken)
                    initializeTooltip()
                    scrollToBottom(channelName)
                });
    
            }
        })
    }
    


    function onClickSidebarChat(){
        $(settings.conversationListing).on('click','.conversationItem', function() {
            var eventObj = {
                event_category: eventMap["viewChatCardClick"]["cat"],
                event_label: 'origin='+origin+',recId='+recruiterId+''
            }
            sendEvent(eventMap["viewChatCardClick"]["event"], eventObj)
            if(!($(this).hasClass("selected"))) {
    
                var channelName = $(this).attr("data-channel-name")
                var chatContainerBox = chatDivBox.clone().removeClass('prototype hidden');
                chatContainerBox.find(settings.candidateName).text($(this).find(settings.userName).text());
                
            
                chatContainerBox.find(settings.chatDivHeader).attr("data-id",$(this).attr("data-id"));
                chatContainerBox.find(settings.infoIcon).attr("data-id",$(this).attr("data-id"));
                chatContainerBox.find(settings.minusIcon).attr("data-id",$(this).attr("data-id"));
                chatContainerBox.find(settings.closeIcon).attr("data-id",$(this).attr("data-id"));
                chatContainerBox.attr("data-id",$(this).attr("data-id"));
                var dataID = $(this).attr("data-id");
    
                var obj = getCandidateFromStore(dataID)
                console.log(obj.userId);
                chatContainerBox.find('.candidate-name').attr("href","/candidate/"+obj.userId+"/profile");
    
                chatContainerBox.attr("data-channel-name",channelName);
                chatContainerBox.find(settings.infoImg).attr("src", (obj["img"] || "/static/images/noimage.png"))
                chatContainerBox.find(".info-container .primary-content").text(obj["name"] + " works as " + obj["designation"] + " at " + obj["organization"])
                if(obj["lastActive"]) {
                    chatContainerBox.find(settings.lastActive).text(moment(obj["lastActive"]).format("DD-MM-YYYY")).removeClass("hidden")
                }
                if(obj["title"] && obj["status"]) {
                    chatContainerBox.find(".info-container .secondary-content").text(obj["name"] + " has applied to " + obj["title"] + " Current Status is "+stat[obj["status"]]+"").removeClass("hidden")
                }
                chatContainerBox.find(settings.chatInput).attr("data-channel-name", channelName)
                chatContainerBox.find(settings.chatInput).attr("data-id",$(this).attr("data-id") );
    
                chatContainerBox.find(settings.chatInput).on("keydown", function(e) {
    
                    if (e.which == 13) {
                        e.preventDefault();
                        displayAMessage(this)
                    } else if (e.which == 13 && !e.shiftKey) {
                        displayAMessage(this)
                    } else if (e.which == 13 && e.shiftKey) {
                        textAreaAdjust(this);
                    } else {
                        textAreaAdjust(this);
                    }
    
                });
                chatContainerBox.find(".no-start").removeClass("hidden")
                chatContainerBox.find(".start").addClass("hidden")
                var that = $(this)
    
                if($(settings.chatCandidateboxes).children().length < maxCandidateChats) {
                    $(settings.chatCandidateboxes).prepend(chatContainerBox);
                    chatContainerBox.find(settings.footerContainer).addClass("show")
                    chatContainerBox.find(settings.chatDivContnet).scroll(function(){
                        var _that = this;
                        clearTimeout(ticker);
                        ticker = setTimeout(function(){
                            checkScrollEnd(_that)
                        },100);
                    })
    
                }
                else {
                    var clonedElement = $(".candidate-collapsed-block.prototype").clone().removeClass('prototype hidden');
                    $(settings.chatCandidateboxes).prepend(chatContainerBox);
                    chatContainerBox.find(settings.footerContainer).addClass("show")
    
                    var hideElement = 1+maxCandidateChats;
                    var dataIdLocal = $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").attr("data-id");
                    clonedElement.attr("data-id",dataIdLocal);
                    clonedElement.html($(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").find(settings.candidateName).text()+"<i data-id="+dataIdLocal+" class='icon-cross_icon' aria-hidden='true'></i>");
                    $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").addClass("hidden");
                    if($(settings.chatCollapsedContainer).hasClass("hidden")) {
                        $(settings.chatCollapsedContainer).removeClass("hidden");
                    }
                    $(".chat-collapsed-candidate-container .chat-collapsed-candidate .chat-collapsed-candidate-wrapper").append(clonedElement);
                }
                reposition_chat_windows();
                that.addClass("selected");
                fetchHistory(channelName, messageNumber , null, null, function(status, response) {
                    console.log(response)
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
    
                    $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content ul").prepend(str)
                    $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content").attr("data-startTime", response.startTimeToken )
                    $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content").attr("data-endTime", response.endTimeToken)
                    initializeTooltip()
                    scrollToBottom(channelName)
                });
    
            }
        })
    
    }

    function closeCollapsedStickyChat(){
        $(settings.chatCollapsedContainerId).on('click',".chat-collapsed-candidate-container .candidate-collapsed-block i", function(event) {
            event.stopPropagation();
            event.preventDefault();
            var dataId = $(this).attr("data-id");

            $("#chat-collapsed-container .candidate-collapsed-block[data-id="+dataId+"]").remove();
            $('.chat-div-candidate[data-id='+dataId+']').remove();
            chatContainer.find(".candidate-card[data-id="+dataId+"]").removeClass("selected-sticky");
            $(settings.conversationListing).find(".conversationItem[data-id="+dataId+"]").removeClass("selected")
            if($(".chat-collapsed-candidate-container .chat-collapsed-candidate-wrapper").children().length == 0) {
                $(settings.chatCollapsedContainer).addClass("hidden");
            }
        })
    }

    function closeCollapsedSidebarChat(){
        $(settings.chatCollapsedContainerId).on('click',".chat-collapsed-candidate-container .candidate-collapsed-block", function(event) {
            event.stopPropagation()
            event.preventDefault()
            var dataId = $(this).attr("data-id");
            $(this).remove();
            var clonedElement = $(".candidate-collapsed-block.prototype").clone().removeClass('prototype hidden');
            var hideElement = maxCandidateChats;
            var elem = $(".chat-candidate-boxes .chat-div-candidate:not(.hidden)").get(maxCandidateChats-1);
            var dataIdLocal = $(elem).attr("data-id");
            clonedElement.attr("data-id",dataIdLocal);
            clonedElement.html($(elem).find(settings.candidateName).text()+"<i data-id="+dataIdLocal+" class='icon-cross_icon' aria-hidden='true'></i>");
            //$(this).attr("data-id",$('.chat-candidate-boxes .chat-div-candidate:nth-child('+maxCandidateChats+')').attr("data-id"));
            $('.chat-candidate-boxes .chat-div-candidate[data-id='+dataId+']').removeClass("hidden");

            $(elem).addClass("hidden");
            $(".chat-collapsed-candidate-container .chat-collapsed-candidate .chat-collapsed-candidate-wrapper").append(clonedElement);
            reposition_chat_windows();
        })
    }

    function populateChatView(array){
        if(array.length==0){
            $('.empty-screen-chat').removeClass('hidden')
        }
        else{
            array.forEach(function(aCandidate) {
                var card = candidatesWrapper.clone().removeClass('prototype hidden');
                card.find(".candidate-image img").attr("src",(aCandidate["img"] || "/static/images/noimage.png"));
                card.attr("data-id",aCandidate["userId"]);
                card.find(settings.candidateName).text(aCandidate["name"]);
                card.find(".candidate-designation").text(aCandidate["designation"]);
                card.attr("data-channel-name" , aCandidate["channel"])
                $(".chat-div .chat-div-content").append(card);
                $(".chat-div .chat-div-content").append("<hr class='divider divider-full'>");
            })
        }
    }

    function onClickCandNameStopEvent(){   
        $('.chat-candidate-boxes').on('click','.candidate-name-container',function(event){
            event.stopPropagation();
            return true
        }) 
    }

    function minimizeSideBarChat(){
        $(settings.chatCandidateboxes).on('click','.chat-div-candidate .chat-div-header', function() {
            var dataId = $(this).attr("data-id");
            $('.chat-div-candidate[data-id='+dataId+'] .content-footer-container').toggleClass("show");
            $('.chat-div-candidate .chat-div-header[data-id='+dataId+'] .minusIcon').toggleClass("active")
        })
    }    
    
    function onClickCloseSidebarChat(){
        $(settings.chatCandidateboxes).on('click','.chat-div-candidate .info-buttons .closeIcon', function(event) {
            event.stopPropagation();
            var dataId = $(this).attr("data-id");
            hideElement = 1 + maxCandidateChats;
            if($(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").hasClass("hidden")) {
                $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").removeClass("hidden");
                var collapsedDataId = $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").attr("data-id");
    
                $(".chat-collapsed-candidate-container .candidate-collapsed-block[data-id="+collapsedDataId+"]").remove();
                if($(".chat-collapsed-candidate-container .chat-collapsed-candidate-wrapper").children().length == 0) {
                    $(settings.chatCollapsedContainer).addClass("hidden");
                }
            }
            $('.chat-div-candidate[data-id='+dataId+']').remove();
            chatContainer.find(".candidate-card[data-id="+dataId+"]").removeClass("selected-sticky");
            $(settings.conversationListing).find(".conversationItem[data-id="+dataId+"]").removeClass("selected")
            reposition_chat_windows();
        })
    }

    function onClickInfoIcon(){
        $(settings.chatCandidateboxes).on('click','.chat-div-candidate .info-buttons .infoIcon', function(event) {
            var eventObj = {
                event_category: eventMap["viewInfo"]["cat"],
                event_label: 'origin='+origin+',recId='+recruiterId+''
            }
            sendEvent(eventMap["viewInfo"]["event"], eventObj)
            var dataId = $(this).attr("data-id");
            if(!($(".chat-candidate-boxes .chat-div-candidate[data-id="+dataId+"] .content-footer-container").hasClass("show"))) {
                return
            }
            event.stopPropagation();
            $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataId+"] .content-footer-container .info-container").toggleClass("hidden")
        })    
    }



    var displayAMessage = function(element) {
        var eventObj = {
            event_category: eventMap["sendMsg"]["cat"],
            event_label: 'origin='+origin+',recId='+recruiterId+''
        }
        sendEvent(eventMap["sendMsg"]["event"], eventObj)
        var channelName = $(element).attr("data-channel-name");
        var dataID = $(element).attr("data-id");
        var message = ($(element).val()).trim()
        var that = $(element)
        if(message == "") {
            return $(element).val('')
        }

            publish({
                UUID:uuid || btoa(recruiterId+'--'+recruiterEmail),
                deviceId: deviceId,
                time: Date.now(),
                usr: recruiterId,
                name: profile["name"],
                tt:1,
                msg: message,
                img: profile.img_link,
                type: 1
            }, channelName, function(status, response){
                if(status.statusCode == 200) {
                    var elem = {}
                    elem.entry = {}
                    elem.entry.msg = message;
                    elem.entry.time = parseInt(moment().format('x'))

                    var item = getMsgSentElement(elem)
                    $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content ul").append(item[0].outerHTML)

                    initializeTooltip()
                    that.val('');
                    that.outerHeight(37);
                    that.closest(settings.footerContainer).find(settings.chatDivContnet).outerHeight(278);

                    scrollToBottom(channelName)
                }
                else if (status.category == "PNNetworkIssuesCategory") {
                    var data = {}
                    var item = getMsgSentElement(elem)
                    $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content ul").append(item[0].outerHTML)

                    data.message = "Looks like you are not connected to the internet"
                    toastNotify(3, data.message)
                }
            });
            submitChatMessage({
                channel: channelName,
                senderName: profile['name'],
                senderOrganization: profile["organisation"],
                timestamp: Date.now(),
                text: message
            })
    }

    function receiveMessage(m) {
        var msg = m.message;
        if(deviceId == msg['deviceId']){
            // debugger
            return
        }
        openChat(m)
        scrollToBottom(m.channel)
    }

    function scrollToBottom(channelName) {
        $(".chat-candidate-boxes .chat-div-candidate[data-channel-name="+channelName+"] .content-footer-container .chat-div-content").scrollTop(jQuery(".chat-candidate-boxes .chat-div-candidate[data-channel-name="+channelName+"] .content-footer-container .chat-div-content ul").outerHeight());
    }

    function openChat(m) {
        var channelName = m.channel;
        var msg = m.message;
        if(window.innerWidth < 768) {
            return
        }
        if($(".chat-candidate-boxes .chat-div-candidate[data-channel-name="+channelName+"]").length){
            var elem = {}
            elem.entry = {}
            elem.entry.msg = msg.msg;
            elem.entry.time = msg.time;
            var item = (msg.UUID == btoa(recruiterId+"--"+profile["email"])) ? getMsgSentElement(elem):  getMsgReceivedElement(elem);
            $(".chat-candidate-boxes .chat-div-candidate[data-channel-name="+channelName+"] .content-footer-container .chat-div-content ul").append(item[0].outerHTML)

            $(".chat-candidate-boxes .chat-div-candidate[data-channel-name="+channelName+"] .chat-div-header").addClass("newMessageHeader")

            return
        }
        else {
            var elem = $(settings.conversationListing).find(".conversationItem[data-channel-name="+channelName+"]");
            var dataID = elem.attr("data-id")
            var chatContainerBox = chatDivBox.clone().removeClass('prototype hidden');

            chatContainerBox.find(settings.chatDivHeader).attr("data-id",dataID);
            chatContainerBox.find(settings.infoIcon).attr("data-id",dataID);
            chatContainerBox.find(settings.minusIcon).attr("data-id",dataID);
            chatContainerBox.find(settings.closeIcon).attr("data-id",dataID);
            chatContainerBox.attr("data-id",dataID);
            var obj = getCandidateFromStore(dataID)
            chatContainerBox.find(settings.candidateName).text(obj["name"]);
            chatContainerBox.attr("data-channel-name",channelName);
            chatContainerBox.find(settings.infoImg).attr("src", (obj["img"] || "/static/images/noimage.png"))
            chatContainerBox.find(".info-container .primary-content").text(obj["name"] + " works as " + obj["designation"] + " at " + obj["organization"])
            if(obj["lastActive"]) {
                chatContainerBox.find(settings.lastActive).text(moment(obj["lastActive"]).format("DD-MM-YYYY")).removeClass("hidden")
            }
            if(obj["title"] && obj["status"]) {
                chatContainerBox.find(".info-container .secondary-content").text(obj["name"] + " has applied to " + obj["title"] + " Current Status is "+stat[obj["status"]]+"").removeClass("hidden")
            }
            chatContainerBox.find(settings.chatInput).attr("data-channel-name", channelName)
            chatContainerBox.find(settings.chatInput).attr("data-id",dataID)
            chatContainerBox.find(settings.chatInput).on("keydown", function(e) {

                if (e.which == 13) {
                    e.preventDefault();
                    displayAMessage(this)
                } else if (e.which == 13 && !e.shiftKey) {
                    displayAMessage(this)
                } else if (e.which == 13 && e.shiftKey) {
                    textAreaAdjust(this);
                } else {
                    textAreaAdjust(this);
                }

            });
            chatContainerBox.find(".no-start").removeClass("hidden")
            chatContainerBox.find(".start").addClass("hidden")

            if($(settings.chatCandidateboxes).children().length < maxCandidateChats) {
                $(settings.chatCandidateboxes).prepend(chatContainerBox);
                chatContainerBox.find(settings.chatDivContnet).scroll(function(){
                    var _that = this;
                    clearTimeout(ticker);
                    ticker = setTimeout(function(){
                        checkScrollEnd(_that)
                    },100);
                })
                chatContainerBox.find(settings.footerContainer).addClass("show")
            }
            else {
                var clonedElement = $(".candidate-collapsed-block.prototype").clone().removeClass('prototype hidden');
                $(settings.chatCandidateboxes).prepend(chatContainerBox);
                chatContainerBox.find(settings.footerContainer).addClass("show")

                var hideElement = 1+maxCandidateChats;
                var dataIdLocal = $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").attr("data-id");
                clonedElement.attr("data-id",dataIdLocal);
                clonedElement.html($(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").find(settings.candidateName).text()+"<i data-id="+dataIdLocal+" class='icon-cross_icon' aria-hidden='true'></i>");
                $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").addClass("hidden");
                if($(settings.chatCollapsedContainer).hasClass("hidden")) {
                    $(settings.chatCollapsedContainer).removeClass("hidden");
                }
                $(".chat-collapsed-candidate-container .chat-collapsed-candidate .chat-collapsed-candidate-wrapper").append(clonedElement);
            }
            reposition_chat_windows();
            $(settings.conversationListing).find(".conversationItem[data-id="+dataID+"]").addClass("selected")
            chatContainer.find('.candidate-card[data-id='+dataID+']').addClass("selected-sticky");
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

                $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content ul").prepend(str)
                $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content").attr("data-startTime", response.startTimeToken )
                $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content").attr("data-endTime", response.endTimeToken)
                initializeTooltip()
                scrollToBottom(channelName)
            });
        }
    }

    function onFocusChatMessage(){
        $(settings.chatCandidateboxes).on('focus','.chat-input', function(){
            $(this).closest('.chat-div-candidate').find('.chat-div-header').removeClass('newMessageHeader')
        });
    }


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
        
        if((chatContainer.find('.candidate-card[data-id='+array[0]["userID"]+']').hasClass("selected-sticky"))) {
            return
        }
        array[0]["userId"] = array[0]["userID"]
        array[0]["jobs"].forEach(function(elem){
            if(elem["is_current"] == 1) {
                array[0]["designation"] == elem["designation"]
            }
        })
        
        if(!(chatContainer.find('.candidate-card[data-channel-name="iimjobs--r'+recruiterId+'-j'+array[0]["userID"]+'"]').length) ) {
            postRequest(baseUrl+"/recruiter/"+recruiterId+"/job/"+jobId+"/application/"+applicationId+"/action/chat", null, {}, function(res, status, xhr){
                if(res.status && res.status =='success'){
                    if(window.innerWidth <= 768) {
                        return window.location.href = '/my-chat?candidateId='+array[0]["userID"]+''
                    }
                    array[0]["channel"] = res.data
                    populateChatView(array)
                    var channelName = res.data
                    var chatContainerBox = chatDivBox.clone().removeClass('prototype hidden');
                    chatContainerBox.find(settings.candidateName).text(array[0]["name"]);
                // chatContainerBox.find(".last-active-date").text(startTime());
                    chatContainerBox.find(settings.chatDivHeader).attr("data-id",array[0]["userID"]);
                    chatContainerBox.find(settings.infoIcon).attr("data-id",array[0]["userID"]);
                    chatContainerBox.find(settings.minusIcon).attr("data-id",array[0]["userID"]);
                    chatContainerBox.find(settings.closeIcon).attr("data-id",array[0]["userID"]);
                    chatContainerBox.attr("data-id",array[0]["userID"]);
                    chatContainerBox.find(settings.chatInput).attr("data-channel-name", channelName)
                    chatContainerBox.find(settings.chatInput).attr("data-id",array[0]["userID"] )
                    chatContainerBox.find(settings.chatInput).on("keydown", function(e) {
                        if (e.which == 13) {
                            e.preventDefault();
                            displayAMessage(this)
                        } else if (e.which == 13 && !e.shiftKey) {
                            displayAMessage(this)
                        } else if (e.which == 13 && e.shiftKey) {
                            textAreaAdjust(this);
                        } else {
                            textAreaAdjust(this);
                        }

                    });
                    chatContainerBox.find(".no-start").addClass("hidden")
                    chatContainerBox.find(".start").removeClass("hidden")
                    chatContainerBox.attr("data-channel-name",channelName);
                    if(array[0]["lastActive"]) {
                        chatContainerBox.find(settings.lastActive).text(moment(array[0]["lastActive"]).format("DD-MM-YYYY")).removeClass("hidden")
                    }
                    var dataID = chatContainerBox.attr("data-id");
                    if($(settings.chatCandidateboxes).children().length < maxCandidateChats) {
                        $(settings.chatCandidateboxes).prepend(chatContainerBox);
                        chatContainerBox.find(settings.footerContainer).addClass("show")
                        chatContainerBox.find(settings.chatDivContnet).scrollTop(chatContainerBox.find(".chat-div-content ul").outerHeight())
                        //setTimeout(function(){ chatContainerBox.find(settings.chatDivContnet).scrollTop(chatContainerBox.find(".chat-div-content ul").outerHeight()); }, 3000)
                    }
                    else {
                        var clonedElement = $(".candidate-collapsed-block.prototype").clone().removeClass('prototype hidden');
                        $(settings.chatCandidateboxes).prepend(chatContainerBox);
                        chatContainerBox.find(settings.footerContainer).addClass("show")
                        //setTimeout(function(){ chatContainerBox.find(settings.chatDivContnet).scrollTop(chatContainerBox.find(".chat-div-content ul").outerHeight()); }, 3000)
                        var hideElement = 1+maxCandidateChats;
                        var dataIdLocal = $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").attr("data-id");
                        clonedElement.attr("data-id",dataIdLocal);
                        clonedElement.html($(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").find(settings.candidateName).text()+"<i data-id="+dataIdLocal+" class='icon-cross_icon' aria-hidden='true'></i>");
                        $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").addClass("hidden");
                    
                        if($(settings.chatCollapsedContainer).hasClass("hidden")) {
                            $(settings.chatCollapsedContainer).removeClass("hidden");
                        }
                        $(".chat-collapsed-candidate-container .chat-collapsed-candidate .chat-collapsed-candidate-wrapper").append(clonedElement);
                    }
                    reposition_chat_windows();

                    chatContainer.find('.candidate-card[data-id='+array[0]["userID"]+']').addClass("selected-sticky");
                    $(settings.conversationListing).find(".conversationItem[data-id="+array[0]["userID"]+"]").addClass("selected")
                }
                }, function(res){

                });
            }

        else {

            if(window.innerWidth <= 768) {
                  window.location.href = staticEndPoints['chat']+'?candidateId='+array[0]["userID"]+''
            }
            var channelName = "iimjobs--r"+recruiterId+"-j"+array[0]["userID"]+"";
            var chatContainerBox = chatDivBox.clone().removeClass('prototype hidden');
            chatContainerBox.find(settings.candidateName).text(array[0]["name"]);
            
            // chatContainerBox.find(settings.candidateName).attr("href","/candidate/"+aCandidate.Id+"/profile");    
            // chatContainerBox.find(".last-active-date").text(startTime());
            chatContainerBox.find(settings.chatDivHeader).attr("data-id",array[0]["userID"]);
            chatContainerBox.find(settings.infoIcon).attr("data-id",array[0]["userID"]);
            chatContainerBox.find(settings.minusIcon).attr("data-id",array[0]["userID"]);
            chatContainerBox.find(settings.closeIcon).attr("data-id",array[0]["userID"]);
            chatContainerBox.attr("data-id",array[0]["userID"]);
            chatContainerBox.find(settings.chatInput).attr("data-channel-name", channelName)
            chatContainerBox.find(settings.chatInput).attr("data-id",array[0]["userID"] )
            chatContainerBox.find(settings.chatInput).on("keydown", function(e) {

                if (e.which == 13) {
                    e.preventDefault();
                    displayAMessage(this)
                } else if (e.which == 13 && !e.shiftKey) {
                    displayAMessage(this)
                } else if (e.which == 13 && e.shiftKey) {
                    textAreaAdjust(this);
                } else {
                    textAreaAdjust(this);
                }

            });
            chatContainerBox.find(".no-start").removeClass("hidden")
            chatContainerBox.find(".start").addClass("hidden")
            chatContainerBox.attr("data-channel-name",channelName);
            var dataID = chatContainerBox.attr("data-id");
            if(array[0]["lastActive"]) {
                chatContainerBox.find(settings.lastActive).text(moment(array[0]["lastActive"]).format("DD-MM-YYYY")).removeClass("hidden")
            }

            fetchHistory(channelName, 20 ,null, null, function(status, response) {

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

                $(".chat-candidate-boxes .chat-div-candidate[data-id="+array[0]["userID"]+"] .content-footer-container .chat-div-content ul").prepend(str)
                $(".chat-candidate-boxes .chat-div-candidate[data-id="+array[0]["userID"]+"] .content-footer-container .chat-div-content").attr("data-startTime", response.startTimeToken )
                $(".chat-candidate-boxes .chat-div-candidate[data-id="+array[0]["userID"]+"] .content-footer-container .chat-div-content").attr("data-endTime", response.endTimeToken)
                initializeTooltip()
                scrollToBottom(channelName)
            });


            if($(settings.chatCandidateboxes).children().length < maxCandidateChats) {
                $(settings.chatCandidateboxes).prepend(chatContainerBox);
                chatContainerBox.find(settings.footerContainer).addClass("show")
                chatContainerBox.find(settings.chatDivContnet).scroll(function(){
                    var _that = this;
                    clearTimeout(ticker);
                    ticker = setTimeout(function(){
                        checkScrollEnd(_that)
                    },100);
                })

            }
            else {
                var clonedElement = $(".candidate-collapsed-block.prototype").clone().removeClass('prototype hidden');
                $(settings.chatCandidateboxes).prepend(chatContainerBox);
                chatContainerBox.find(settings.footerContainer).addClass("show")

                var hideElement = 1+maxCandidateChats;
                var dataIdLocal = $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").attr("data-id");
                clonedElement.attr("data-id",dataIdLocal);
                clonedElement.html($(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").find(settings.candidateName).text()+"<i data-id="+dataIdLocal+" class='icon-cross_icon' aria-hidden='true'></i>");
                $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").addClass("hidden");
                if($(settings.chatCollapsedContainer).hasClass("hidden")) {
                    $(settings.chatCollapsedContainer).removeClass("hidden");
                }
                $(".chat-collapsed-candidate-container .chat-collapsed-candidate .chat-collapsed-candidate-wrapper").append(clonedElement);
            }
            reposition_chat_windows();
            chatContainer.find('.candidate-card[data-id='+array[0]["userID"]+']').addClass("selected-sticky");
            $(settings.conversationListing).find(".conversationItem[data-id="+array[0]["userID"]+"]").addClass("selected")
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

        if(!($(settings.chatCollapsedContainer).hasClass("hidden"))) {
            $(settings.chatCollapsedContainer).css("right", rightOffset );
        }
    }

    function checkScrollEnd(elem) {

        if($(elem).scrollTop() < 5) {
            var channelName = $(elem).closest(".chat-div-candidate").attr("data-channel-name");
            var startTimeToken = parseInt($(elem).attr("data-startTime"));
            var endTimeToken = parseInt($(elem).attr("data-endTime"));
            var dataID = $(elem).closest(".chat-div-candidate").attr("data-id");
            if(startTimeToken == 0) {
                return
            }

            fetchHistory(channelName , messageNumber , startTimeToken, null, function(status, response) {

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

                $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content ul").prepend(str)
                $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content").attr("data-startTime", response.startTimeToken )
                $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content").attr("data-endTime", response.endTimeToken)
                initializeTooltip()

            });
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

})