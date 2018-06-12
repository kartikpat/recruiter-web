
function stickyChatModel(){
    var ticker;
    // var count = 0; 
    // var recruiterName = profile.name
    var recruiterEmail = profile.email
    var messageNumber = 20;
    // var deviceId=getDeviceId();
    var settings={};
    var stat = {
        "": "Unread",
        1: "Shortlisted",
        2: "Rejected",
        3: "Saved",
        4: "Reviewed",
        5: "Reviewed"
    };
    var chatStore= {}

    function init(){
        settings.chatCollapsedContainer=$(".chat-collapsed-candidate-container");
        settings.conversationListingContainer=$('#conversationListingContainer');
        settings.chatDiv=$('.chat-div');
        settings.chatCollapsedContainerId=$("#chat-collapsed-container");
        settings.chatCandidateboxes=$(".chat-candidate-boxes");    
        settings.conversationListing=$("#conversationListing");
        settings.chatDivBox=$(".chat-div-candidate.prototype");
        settings.candidatesWrapper=$(".candidate-card.prototype")    
        settings.chatDivHeader=".chat-div-header";
        settings.minusIcon=".info-buttons .minusIcon";
        settings.chatDivContnet=".chat-div-content";
        settings.messageSentPrototype=$(".message.sent.prototype");
        settings.messageRecievedPrototype=$(".message.received.prototype");
        settings.messageContent=".msgContent";
        settings.footerContainer=".content-footer-container";
        settings.candidateName=".candidate-name";
        settings.infoIcon=".info-buttons .infoIcon";
        settings.closeIcon=".info-buttons .closeIcon";
        settings.chatInput=".chat-input";
        settings.infoImg=".info-container img";
        settings.lastActive=".lastActiveDate";
        settings.userName=".user-name";
        settings.userImage=".user-image img";
        settings.userDesignation=".user-designation";
        var width=window.innerWidth;

        if (width< 1000) {
            maxCandidateChats = 1
        } else {
            if (width < 1450) {

                maxCandidateChats = 2
            } else {

                maxCandidateChats = 3
            }
        }


        if(width > 1024 ){
            settings.conversationListingContainer.removeClass("hidden")
        }

        if(width > 768 && width <= 1024 ){
            settings.chatDiv.removeClass("hidden")
        }

        closeCollapsedSidebarChat();
        closeCollapsedStickyChat();
        onClickCandNameStopEvent();
        minimizeSideBarChat();
        onClickCloseSidebarChat();
        onClickInfoIcon();
        onFocusChatMessage();
        toggleMinimiseIcon();        

        $(".chat-collapsed-candidate-container .chat-collapsed-candidate").click(function(){
            $(this).find(".chat-collapsed-candidate-wrapper").toggleClass("hidden")
        })

    }    


    function saveToStore(dataArray){
        dataArray.forEach(function(anObj) {
            chatStore[anObj["userId"]] = anObj;
            chatStore[anObj["channel"]]=anObj;
        })
    }

    function getCandidateFromStore(candidateId){
        return chatStore[candidateId]
    }
    function getCandidateFromStoreViaChannel(channelName){
        return chatStore[channelName];
    }
    
    function toggleMinimiseIcon(){
        $(settings.chatDivHeader).click(function() {
            $(this).find(".minusIcon").toggleClass("active")
            $(settings.chatDivContnet).toggleClass("show");
        });
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
        settings.conversationListing.append(str)
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
        var card =settings.messageSentPrototype.clone().removeClass('prototype hidden')
        var time;
        time = moment(data["entry"]["time"]).format("DD MMMM YYYY") + " , ";
        time += moment(data["entry"]["time"]).format("hh:mm a");
        card.find(settings.messageContent).html(data["entry"]["msg"]).attr("title", time);
        // card.find('.msgContent').append("<span class='icon-container'><i class='icon-history-button'></i></span>")
        return card
    }


    function getMsgReceivedElement(data) {
        var card =settings.messageRecievedPrototype.clone().removeClass('prototype hidden')
        var time;
        time = moment(data["entry"]["time"]).format("DD MMMM YYYY") + " , ";
        time += moment(data["entry"]["time"]).format("hh:mm a");
        card.find(settings.messageContent).html(data["entry"]["msg"]).attr("title", time);
        return card
    }

    function appendSendMessage(channelName,message,dataID) {
        var elem = {}
        elem.entry = {}
        elem.entry.msg = message;
        var item = getMsgSentElement(elem)
        $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content ul").append(item[0].outerHTML)
        initializeTooltip()
        scrollToBottom(channelName)
        $(".chat-input").val("");
    }
    
    function textAreaAdjust(o) {
        if(o.scrollHeight == 35 || o.scrollHeight > 75) {
            return
        }
        o.style.height = (o.scrollHeight + 2) + "px";
        $(o).closest(settings.footerContainer).find(settings.chatDivContnet).height(293 - (o.scrollHeight));
    }

    function onClickStickyChat(fn){
        settings.chatDiv.on('click','.candidate-card', function() {
            if(!($(this).hasClass("selected-sticky"))) {
                var channelName = $(this).attr("data-channel-name")
                var chatContainerBox = settings.chatDivBox.clone().removeClass('prototype hidden');
                chatContainerBox.find(settings.candidateName).text($(this).find(settings.candidateName).text());
                chatContainerBox.find(settings.candidateName).attr("href","/candidate/"+$(this).attr("data-id")+"/profile");
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
                chatContainerBox.find(".no-start").removeClass("hidden")
                chatContainerBox.find(".start").addClass("hidden")
                var that = $(this)
                if(settings.chatCandidateboxes.children().length < maxCandidateChats){
                    settings.chatCandidateboxes.prepend(chatContainerBox);
                    chatContainerBox.find(settings.footerContainer).addClass("show")
                    chatContainerBox.find(settings.chatDivContnet).scroll(function(){
                        var _that = this;
                        clearTimeout(ticker);
                        ticker = setTimeout(function(){
                            if(checkScrollEnd(_that))
                            fn(channelName,messageNumber,dataID);
                        },100);
                    })
    
                }
                else {
                    var clonedElement = $(".candidate-collapsed-block.prototype").clone().removeClass('prototype hidden');
                    settings.chatCandidateboxes.prepend(chatContainerBox);
                    chatContainerBox.find(settings.footerContainer).addClass("show")
                    var hideElement = 1+maxCandidateChats;
                    var dataIdLocal = $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").attr("data-id");
                    clonedElement.attr("data-id",dataIdLocal);
                    clonedElement.html($(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").find(settings.candidateName).text()+"<i data-id="+dataIdLocal+" class='icon-cross_icon' aria-hidden='true'></i>");
                    $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").addClass("hidden");
                    if(settings.chatCollapsedContainer.hasClass("hidden")) {
                        settings.chatCollapsedContainer.removeClass("hidden");
                    }
                    $(".chat-collapsed-candidate-container .chat-collapsed-candidate .chat-collapsed-candidate-wrapper").append(clonedElement);
                }
                reposition_chat_windows();
                that.addClass("selected-sticky");
                fn(channelName,messageNumber,dataID);
            }
        })
    }


    function onEnterSendMessage(fn){
        $('.chat-candidate-boxes').on("keydown",'.chat-div-candidate .chat-input',function(e){
            var dataID=$(this).attr("data-id");
            var channelName=$(this).attr("data-channel-name");
            if (e.which == 13) {
                e.preventDefault();
                var value=$(".chat-input").val();
                fn(dataID,channelName,value)
            }else if (e.which == 13 && !e.shiftKey) {
                fn(dataID,channelName,value)
            }else if (e.which == 13 && e.shiftKey) {
                textAreaAdjust(this);
            } else {
                textAreaAdjust(this);
            }
        });
    }
    
    function populateMessages(response,obj,channelName){
        var dataArray=response.messages;
        var dataId=obj.userId;
        var str = ""
        dataArray.forEach(function(elem, index){
            if(index == 0 || (index > 0 && (moment(dataArray[index - 1]["entry"]["time"]).format("DD MM YYYY") != moment(elem["entry"]["time"]).format("DD MM YYYY"))) ) {
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
        $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataId+"] .content-footer-container .chat-div-content ul").prepend(str)
        $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataId+"] .content-footer-container .chat-div-content").attr("data-startTime", response.startTimeToken )
        $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataId+"] .content-footer-container .chat-div-content").attr("data-endTime", response.endTimeToken)
       
        initializeTooltip()
        console.log(channelName)
        debugger
        scrollToBottom(channelName)
    }


    function onClickSidebarChat(fn){
        settings.conversationListing.on('click','.conversationItem', function() {
            if(!($(this).hasClass("selected"))) {
                var channelName = $(this).attr("data-channel-name")
                var chatContainerBox = settings.chatDivBox.clone().removeClass('prototype hidden');
                chatContainerBox.find(settings.candidateName).text($(this).find(settings.userName).text());
                chatContainerBox.find(settings.chatDivHeader).attr("data-id",$(this).attr("data-id"));
                chatContainerBox.find(settings.infoIcon).attr("data-id",$(this).attr("data-id"));
                chatContainerBox.find(settings.minusIcon).attr("data-id",$(this).attr("data-id"));
                chatContainerBox.find(settings.closeIcon).attr("data-id",$(this).attr("data-id"));
                chatContainerBox.attr("data-id",$(this).attr("data-id"));
                var dataID = $(this).attr("data-id");
                var obj = getCandidateFromStore(dataID)
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
                chatContainerBox.find(".no-start").removeClass("hidden")
                chatContainerBox.find(".start").addClass("hidden")
                var that = $(this)
                if(settings.chatCandidateboxes.children().length < maxCandidateChats) {
                    settings.chatCandidateboxes.prepend(chatContainerBox);
                    chatContainerBox.find(settings.footerContainer).addClass("show")
                    chatContainerBox.find(settings.chatDivContnet).scroll(function(){
                        var _that = this;
                        clearTimeout(ticker);
                        ticker = setTimeout(function(){
                            if(checkScrollEnd(_that))
                            fn(channelName,messageNumber,dataID);
                        },100);
                    })
    
                }
                else {
                    var clonedElement = $(".candidate-collapsed-block.prototype").clone().removeClass('prototype hidden');
                    settings.chatCandidateboxes.prepend(chatContainerBox);
                    chatContainerBox.find(settings.footerContainer).addClass("show");
                    var hideElement = 1+maxCandidateChats;
                    var dataIdLocal = $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").attr("data-id");
                    clonedElement.attr("data-id",dataIdLocal);
                    clonedElement.html($(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").find(settings.candidateName).text()+"<i data-id="+dataIdLocal+" class='icon-cross_icon' aria-hidden='true'></i>");
                    $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").addClass("hidden");
                    if(settings.chatCollapsedContainer.hasClass("hidden")) {
                        settings.chatCollapsedContainer.removeClass("hidden");
                    }
                    $(".chat-collapsed-candidate-container .chat-collapsed-candidate .chat-collapsed-candidate-wrapper").append(clonedElement);
                }
                reposition_chat_windows();
                that.addClass("selected");
                fn(channelName,messageNumber,dataID);
            }
        })
    }

    function closeCollapsedStickyChat(){
        settings.chatCollapsedContainerId.on('click',".chat-collapsed-candidate-container .candidate-collapsed-block i", function(event) {
            event.stopPropagation();
            event.preventDefault();
            var dataId = $(this).attr("data-id");

            $("#chat-collapsed-container .candidate-collapsed-block[data-id="+dataId+"]").remove();
            $('.chat-div-candidate[data-id='+dataId+']').remove();
            settings.chatDiv.find(".candidate-card[data-id="+dataId+"]").removeClass("selected-sticky");
            settings.conversationListing.find(".conversationItem[data-id="+dataId+"]").removeClass("selected")
            if($(".chat-collapsed-candidate-container .chat-collapsed-candidate-wrapper").children().length == 0) {
                settings.chatCollapsedContainer.addClass("hidden");
            }
        })
    }

    function closeCollapsedSidebarChat(){
        settings.chatCollapsedContainerId.on('click',".chat-collapsed-candidate-container .candidate-collapsed-block", function(event) {
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
                var card = settings.candidatesWrapper.clone().removeClass('prototype hidden');
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
        settings.chatCandidateboxes.on('click','.chat-div-candidate .chat-div-header', function() {
            var dataId = $(this).attr("data-id");
            $('.chat-div-candidate[data-id='+dataId+'] .content-footer-container').toggleClass("show");
            $('.chat-div-candidate .chat-div-header[data-id='+dataId+'] .minusIcon').toggleClass("active")
        })
    }    
    
    function onClickCloseSidebarChat(){
        settings.chatCandidateboxes.on('click','.chat-div-candidate .info-buttons .closeIcon', function(event) {
            event.stopPropagation();
            var dataId = $(this).attr("data-id");
            hideElement = 1 + maxCandidateChats;
            if($(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").hasClass("hidden")) {
                $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").removeClass("hidden");
                var collapsedDataId = $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").attr("data-id");
    
                $(".chat-collapsed-candidate-container .candidate-collapsed-block[data-id="+collapsedDataId+"]").remove();
                if($(".chat-collapsed-candidate-container .chat-collapsed-candidate-wrapper").children().length == 0) {
                    settings.chatCollapsedContainer.addClass("hidden");
                }
            }
            $('.chat-div-candidate[data-id='+dataId+']').remove();
            settings.chatDiv.find(".candidate-card[data-id="+dataId+"]").removeClass("selected-sticky");
            settings.conversationListing.find(".conversationItem[data-id="+dataId+"]").removeClass("selected")
            reposition_chat_windows();
        })
    }

    function onClickInfoIcon(){
        settings.chatCandidateboxes.on('click','.chat-div-candidate .info-buttons .infoIcon', function(event) {
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

    function scrollToBottom(channelName) {
        debugger
        console.log(channelName);
        console.log("............................")
        $(".chat-candidate-boxes .chat-div-candidate[data-channel-name="+channelName+"] .content-footer-container .chat-div-content").scrollTop(jQuery(".chat-candidate-boxes .chat-div-candidate[data-channel-name="+channelName+"] .content-footer-container .chat-div-content ul").outerHeight());
    }

    function isChatBoxOpen(channelName){
        if($(".chat-candidate-boxes .chat-div-candidate[data-channel-name="+channelName+"]").length){
            return true
        }
    }

    function appendRecievedMessage(channelName,message) {
        var elem = {}
        elem.entry = {}
        elem.entry.msg = message;
        var item = (msg.UUID == btoa(recruiterId+"--"+profile["email"])) ? getMsgSentElement(elem):  getMsgReceivedElement(elem);    
        $(".chat-candidate-boxes .chat-div-candidate[data-channel-name="+channelName+"] .content-footer-container .chat-div-content ul").append(item[0].outerHTML)
        $(".chat-candidate-boxes .chat-div-candidate[data-channel-name="+channelName+"] .chat-div-header").addClass("newMessageHeader")
    }

    function openChatBox(channelName){
        var elem = settings.conversationListing.find(".conversationItem[data-channel-name="+channelName+"]");
        var dataID = elem.attr("data-id")
        var chatContainerBox = settings.chatDivBox.clone().removeClass('prototype hidden');
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
        chatContainerBox.find(".no-start").removeClass("hidden")
        chatContainerBox.find(".start").addClass("hidden")
        if(settings.chatCandidateboxes.children().length < maxCandidateChats) {
            settings.chatCandidateboxes.prepend(chatContainerBox);
            chatContainerBox.find(settings.chatDivContnet).scroll(function(){
                var _that = this;
                clearTimeout(ticker);
                ticker = setTimeout(function(){
                    if(checkScrollEnd(_that))
                        fn(channelName,messageNumber,dataID);
                },100);
            })
            chatContainerBox.find(settings.footerContainer).addClass("show")
        }
        else {
            var clonedElement = $(".candidate-collapsed-block.prototype").clone().removeClass('prototype hidden');
            settings.chatCandidateboxes.prepend(chatContainerBox);
            chatContainerBox.find(settings.footerContainer).addClass("show")

            var hideElement = 1+maxCandidateChats;
            var dataIdLocal = $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").attr("data-id");
            clonedElement.attr("data-id",dataIdLocal);
            clonedElement.html($(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").find(settings.candidateName).text()+"<i data-id="+dataIdLocal+" class='icon-cross_icon' aria-hidden='true'></i>");
            $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").addClass("hidden");
            if(settings.chatCollapsedContainer.hasClass("hidden")) {
                settings.chatCollapsedContainer.removeClass("hidden");
            }
            $(".chat-collapsed-candidate-container .chat-collapsed-candidate .chat-collapsed-candidate-wrapper").append(clonedElement);
        }
        reposition_chat_windows();
        settings.conversationListing.find(".conversationItem[data-id="+dataID+"]").addClass("selected")
        settings.chatDiv.find('.candidate-card[data-id='+dataID+']').addClass("selected-sticky");
        // fetchHistory(channelName, 20 , null, null, function(status, response) {
        
        //     var str = ""
        //     response["messages"].forEach(function(elem, index){
        //         if(index == 0 || (index > 0 && (moment(response["messages"][index - 1]["entry"]["time"]).format("DD MM YYYY") != moment(elem["entry"]["time"]).format("DD MM YYYY"))) ) {
        //             var item = getTimeElement(elem)
        //             str+=item[0].outerHTML;
        //         }
        //         if(elem["entry"]["UUID"] == btoa(recruiterId+'--'+recruiterEmail) ) {

        //             var item = getMsgSentElement(elem)
        //             str+=item[0].outerHTML;
        //         }
        //         else {
        //             var item = getMsgReceivedElement(elem)
        //             str+=item[0].outerHTML;
        //         }
        //     })

        //     $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content ul").prepend(str)
        //     $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content").attr("data-startTime", response.startTimeToken )
        //     $(".chat-candidate-boxes .chat-div-candidate[data-id="+dataID+"] .content-footer-container .chat-div-content").attr("data-endTime", response.endTimeToken)
        //     initializeTooltip()
        //     scrollToBottom(channelName)
        // });
    }


    // function openChat(m) {
    //     var channelName = m.channel;
    //     var msg = m.message;
    //     if(window.innerWidth < 768) {
    //         return
    //     }
    //     //if box is already open
    //     if($(".chat-candidate-boxes .chat-div-candidate[data-channel-name="+channelName+"]").length){
    //         var elem = {}
    //         elem.entry = {}
    //         elem.entry.msg = msg.msg;
    //         elem.entry.time = msg.time;
    //         var item = (msg.UUID == btoa(recruiterId+"--"+profile["email"])) ? getMsgSentElement(elem):  getMsgReceivedElement(elem);    
    //         $(".chat-candidate-boxes .chat-div-candidate[data-channel-name="+channelName+"] .content-footer-container .chat-div-content ul").append(item[0].outerHTML)
    //         $(".chat-candidate-boxes .chat-div-candidate[data-channel-name="+channelName+"] .chat-div-header").addClass("newMessageHeader")
    //         return
    //     }
    //     //clone the box and fetch history
    //     else 
    // }

    function onFocusChatMessage(){
        settings.chatCandidateboxes.on('focus','.chat-input', function(){
            $(this).closest('.chat-div-candidate').find('.chat-div-header').removeClass('newMessageHeader')
        });
    }


    function getUUID() {
        return pubnub.getUUID();
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
        if((settings.chatDiv.find('.candidate-card[data-id='+array[0]["userID"]+']').hasClass("selected-sticky"))) {
            return
        }
        array[0]["userId"] = array[0]["userID"]
        array[0]["jobs"].forEach(function(elem){
            if(elem["is_current"] == 1) {
                array[0]["designation"] == elem["designation"]
            }
        })
        if(!(settings.chatDiv.find('.candidate-card[data-channel-name="iimjobs--r'+recruiterId+'-j'+array[0]["userID"]+'"]').length) ) {
            postRequest(baseUrl+"/recruiter/"+recruiterId+"/job/"+jobId+"/application/"+applicationId+"/action/chat", null, {}, function(res, status, xhr){
                if(res.status && res.status =='success'){
                    if(window.innerWidth <= 768) {
                        return window.location.href = '/my-chat?candidateId='+array[0]["userID"]+''
                    }
                    array[0]["channel"] = res.data
                    populateChatView(array)
                    var channelName = res.data
                    var chatContainerBox = settings.chatDivBox.clone().removeClass('prototype hidden');
                    chatContainerBox.find(settings.candidateName).text(array[0]["name"]);
                    chatContainerBox.find(settings.chatDivHeader).attr("data-id",array[0]["userID"]);
                    chatContainerBox.find(settings.infoIcon).attr("data-id",array[0]["userID"]);
                    chatContainerBox.find(settings.minusIcon).attr("data-id",array[0]["userID"]);
                    chatContainerBox.find(settings.closeIcon).attr("data-id",array[0]["userID"]);
                    chatContainerBox.attr("data-id",array[0]["userID"]);
                    chatContainerBox.find(settings.chatInput).attr("data-channel-name", channelName)
                    chatContainerBox.find(settings.chatInput).attr("data-id",array[0]["userID"] );
                    chatContainerBox.find(".no-start").addClass("hidden")
                    chatContainerBox.find(".start").removeClass("hidden")
                    chatContainerBox.attr("data-channel-name",channelName);
                    if(array[0]["lastActive"]) {
                        chatContainerBox.find(settings.lastActive).text(moment(array[0]["lastActive"]).format("DD-MM-YYYY")).removeClass("hidden")
                    }
                    var dataID = chatContainerBox.attr("data-id");
                    if(settings.chatCandidateboxes.children().length < maxCandidateChats) {
                        settings.chatCandidateboxes.prepend(chatContainerBox);
                        chatContainerBox.find(settings.footerContainer).addClass("show")
                        chatContainerBox.find(settings.chatDivContnet).scrollTop(chatContainerBox.find(".chat-div-content ul").outerHeight())
                        //setTimeout(function(){ chatContainerBox.find(settings.chatDivContnet).scrollTop(chatContainerBox.find(".chat-div-content ul").outerHeight()); }, 3000)
                    }
                    else {
                        var clonedElement = $(".candidate-collapsed-block.prototype").clone().removeClass('prototype hidden');
                        settings.chatCandidateboxes.prepend(chatContainerBox);
                        chatContainerBox.find(settings.footerContainer).addClass("show")
                        //setTimeout(function(){ chatContainerBox.find(settings.chatDivContnet).scrollTop(chatContainerBox.find(".chat-div-content ul").outerHeight()); }, 3000)
                        var hideElement = 1+maxCandidateChats;
                        var dataIdLocal = $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").attr("data-id");
                        clonedElement.attr("data-id",dataIdLocal);
                        clonedElement.html($(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").find(settings.candidateName).text()+"<i data-id="+dataIdLocal+" class='icon-cross_icon' aria-hidden='true'></i>");
                        $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").addClass("hidden");
                    
                        if(settings.chatCollapsedContainer.hasClass("hidden")) {
                            settings.chatCollapsedContainer.removeClass("hidden");
                        }
                        $(".chat-collapsed-candidate-container .chat-collapsed-candidate .chat-collapsed-candidate-wrapper").append(clonedElement);
                    }
                    reposition_chat_windows();

                    settings.chatDiv.find('.candidate-card[data-id='+array[0]["userID"]+']').addClass("selected-sticky");
                    settings.conversationListing.find(".conversationItem[data-id="+array[0]["userID"]+"]").addClass("selected")
                }
                }, function(res){

                });
            }

        else {

            if(window.innerWidth <= 768) {
            
            window.location.href = staticEndPoints['chat']+'?candidateId='+array[0]["userID"]+''
            }
            var channelName = "iimjobs--r"+recruiterId+"-j"+array[0]["userID"]+"";
            var chatContainerBox = settings.chatDivBox.clone().removeClass('prototype hidden');
            chatContainerBox.find(settings.candidateName).text(array[0]["name"]);
            chatContainerBox.find(settings.chatDivHeader).attr("data-id",array[0]["userID"]);
            chatContainerBox.find(settings.infoIcon).attr("data-id",array[0]["userID"]);
            chatContainerBox.find(settings.minusIcon).attr("data-id",array[0]["userID"]);
            chatContainerBox.find(settings.closeIcon).attr("data-id",array[0]["userID"]);
            chatContainerBox.attr("data-id",array[0]["userID"]);
            chatContainerBox.find(settings.chatInput).attr("data-channel-name", channelName)
            chatContainerBox.find(settings.chatInput).attr("data-id",array[0]["userID"] )
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


            if(settings.chatCandidateboxes.children().length < maxCandidateChats) {
                settings.chatCandidateboxes.prepend(chatContainerBox);
                chatContainerBox.find(settings.footerContainer).addClass("show")
                chatContainerBox.find(settings.chatDivContnet).scroll(function(){
                    var _that = this;
                    clearTimeout(ticker);
                    ticker = setTimeout(function(){
                        if(checkScrollEnd(_that))
                            fn(channelName,messageNumber,dataID);
                    },100);
                })

            }
            else {
                var clonedElement = $(".candidate-collapsed-block.prototype").clone().removeClass('prototype hidden');
                settings.chatCandidateboxes.prepend(chatContainerBox);
                chatContainerBox.find(settings.footerContainer).addClass("show")
                var hideElement = 1+maxCandidateChats;
                var dataIdLocal = $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").attr("data-id");
                clonedElement.attr("data-id",dataIdLocal);
                clonedElement.html($(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").find(settings.candidateName).text()+"<i data-id="+dataIdLocal+" class='icon-cross_icon' aria-hidden='true'></i>");
                $(".chat-candidate-boxes .chat-div-candidate:nth-child("+hideElement+")").addClass("hidden");
                if(settings.chatCollapsedContainer.hasClass("hidden")) {
                    settings.chatCollapsedContainer.removeClass("hidden");
                }
                $(".chat-collapsed-candidate-container .chat-collapsed-candidate .chat-collapsed-candidate-wrapper").append(clonedElement);
            }
            reposition_chat_windows();
            settings.chatDiv.find('.candidate-card[data-id='+array[0]["userID"]+']').addClass("selected-sticky");
            settings.conversationListing.find(".conversationItem[data-id="+array[0]["userID"]+"]").addClass("selected")
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
        if(!(settings.chatCollapsedContainer.hasClass("hidden"))) {
            settings.chatCollapsedContainer.css("right", rightOffset );
        }
    }

    function checkScrollEnd(elem) {
        if($(elem).scrollTop() < 5) {
            var channelName = $(elem).closest(".chat-div-candidate").attr("data-channel-name");
            var startTimeToken = parseInt($(elem).attr("data-startTime"));
            var endTimeToken = parseInt($(elem).attr("data-endTime"));
            var dataID = $(elem).closest(".chat-div-candidate").attr("data-id");
            if(startTimeToken == 0) {
                return ;
            }
            return true;
        }
        return false;
    }

    function initializeTooltip() {
        $(".tooltip").not(".prototype .tooltip").tooltipster({
            animation: 'fade',
            delay: 0,
            side:['bottom'],
            theme: 'tooltipster-borderless'
        })
    }
    
    function fetchHistory(channel, count,startTimeToken, endTimeToken, onFetchHistory) {
        pubnub.history({
            channel: channel, //"my_channel",
            count: count,
            stringifiedTimeToken: true,
            start: startTimeToken,
            end: endTimeToken
        }, onFetchHistory);
    }
    
    return{
        init:init,
        populateChatView:populateChatView,
        populateSideChatView:populateSideChatView,
        saveToStore:saveToStore,
        receivePresence:receivePresence,
        onClickSidebarChat:onClickSidebarChat,
        populateMessages:populateMessages,
        onClickStickyChat:onClickStickyChat,
        getCandidateFromStore:getCandidateFromStore,
        onEnterSendMessage:onEnterSendMessage,
        appendSendMessage:appendSendMessage,
        scrollToBottom:scrollToBottom,
        isChatBoxOpen:isChatBoxOpen,
        appendRecievedMessage:appendRecievedMessage,
        openChatBox:openChatBox,
        getCandidateFromStoreViaChannel:getCandidateFromStoreViaChannel
    }

}