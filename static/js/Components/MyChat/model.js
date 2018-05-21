function Chat() {

   var settings = {};
   var config = {};

   function setConfig(key, value) {
       config[key] = value;
   }

   function init() {
       settings.isActive= $('#isActive'),
       settings.isOnline= $('#isOnline'),
       settings.recruiterName= $('.recruiterName'),
       settings.userName= $('.userName'),
       settings.searchCandidate= $("#searchCandidate"),
       settings.conversationItemList= $("#conversationItemList"),
       settings.msgContent= $("#msgContent"),
       settings.sendMsg= $("#sendMsg"),
       settings.userImg= $(".userImg"),
       settings.userOrg= $(".userOrg"),
       settings.userDes= $(".userDes"),
       settings.userPhone= $(".userPhone"),
       settings.userLoc= $(".userLoc"),
       settings.userExp= $(".userExp"),
       settings.conversationItemClass = ".conversationItem",
       settings.mssgContainer = $("#mssgContainer"),
       settings.recruiterFullName = "",
       settings.channelName = "",
       settings.candidateId = null,
       settings.welcomeContainer = $(".welcomeContainer"),
       settings.chatWindow = $(".chatWindow"),
       settings.userProfile = $(".userProfile"),
       settings.conversationList = $(".conversationList"),
       settings.backButtonChat = $(".backButtonChat"),
       settings.uuid = "",
       settings.index = -1;
       settings.candImage = $(".candImage")
       onClickBackButton()
   }

   function onInputSearchCandidate(fn) {
       settings.searchCandidate.on('input',function(){
           var str = $(this).val();
          	str=str.toLowerCase();
            fn(str)
       })
   }

   function getElement(id) {
       var card = $(".conversationItem.prototype").clone().removeClass('prototype hidden')
       card.attr('data-candidate-id', id);

       return {
           element: card,
           image: card.find('.userImg'),
           name: card.find('.userName'),
           designation: card.find('.userDesignation'),
           candStatus: card.find('.candStatus')
       }
   }

   function createElement(aData) {
       var item = getElement(aData["userId"]);
       item.image.attr("src", (aData["img"] || "/static/images/noimage.png"))
       item.name.text(aData["name"]);
       item.designation.text(aData["designation"]);
       item.element.attr("data-channel-name", aData["channel"]);
       return item
   }


   function addToList(dataArray){
       var str = '';
       $('.loading.loaderScroller.first').addClass("hidden")

    //    if(!dataArray.length) {
    //     return $(".empty-screen.no-list").removeClass("hidden")
    //    }

       dataArray.forEach(function(aData, index){
           var item = createElement(aData);

           str+=item.element[0].outerHTML;
           str+= '<div class="conversation-item-separator"></div>'
       });
       settings.conversationItemList.html(str);
        settings.conversationItemList.closest(".conversations-list").removeClass("hidden")
        settings.welcomeContainer.removeClass("hidden")
   }

   // function setProfile(obj) {
   //     settings.recruiterName.text(obj["name"]);
   //     settings.recruiterFullName = obj["name"]
   // }

   function setCandidateProfile(obj) {
       settings.userImg.attr("src", (obj["img"] || "/static/images/noimage.png"));
       settings.userName.text(obj["name"]);
       settings.userPhone.text(obj["phone"]);
       settings.userDes.text(obj["designation"]);
       settings.userOrg.text(obj["organization"]);
       settings.userLoc.text(obj["location"]);
       if(obj["exp"]) {
           settings.userExp.text(obj["exp"]["year"] + "y " + obj["exp"]["month"] + "m")
       }
   }

   function onClickSingleChatItem(fn) {
       settings.conversationItemList.on('click', settings.conversationItemClass, function(){

           $(settings.conversationItemClass).removeClass("conversation-item-active")
           $(this).addClass("conversation-item-active")
           var channelName = $(this).attr("data-channel-name");
           $(this).find(".newMsgNotify").attr("data-count", "0").addClass("hidden")
           if(settings.channelName == channelName ) {
               return
           }
           var candidateId = $(this).attr("data-candidate-id");
           settings.msgContent.attr("data-channel-name",channelName)
           settings.candidateId = candidateId
           settings.channelName = channelName
           if($(window).outerWidth() < 769 ) {
               return fn(candidateId)
           }
           settings.welcomeContainer.addClass("hidden")
           settings.mssgContainer.empty()
           fn(candidateId)
       })
   }

   function setChat(channelName, candidateId) {
       settings.msgContent.attr("data-channel-name",channelName)
       settings.candidateId = candidateId
       settings.channelName = channelName
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

       var card = $(".message.sent.prototype").clone().removeClass('prototype hidden')

    //    card.find(".useImg").attr("src", (data["entry"]["img"] || "/static/images/noimage.png"))
       var time;
       time = moment(data["entry"]["time"]).format("DD MMMM YYYY") + " , ";
       time += moment(data["entry"]["time"]).format("hh:mm a");
       card.find(".msgContent").html(data["entry"]["msg"]).attr("title", time);
       return card
   }

   function getMsgReceivedElement(data, flag) {
       var card = $(".message.received.prototype").clone().removeClass('prototype hidden')
       if(flag == 1) {
           card.find(".useImg").attr("src", (data["entry"]["img"] || "/static/images/noimage.png")).removeClass("invisible")
       }
       var time;
       time = moment(data["entry"]["time"]).format("DD MMMM YYYY") + " , ";
       time += moment(data["entry"]["time"]).format("hh:mm a");
       card.find(".msgContent").html(data["entry"]["msg"]).attr("title", time);
       return card
   }

   function populateMessages(dataArray) {

        var str = ""
        var flag = 1;
        dataArray.forEach(function(elem, index){

               if(index == 0 || (index > 0 && (moment(dataArray[index - 1]["entry"]["time"]).format("DD MM YYYY") != moment(elem["entry"]["time"]).format("DD MM YYYY"))) ) {
                   var item = getTimeElement(elem)
                   str+=item[0].outerHTML;
               }

               if(elem["entry"]["UUID"] == settings.uuid ){
                    var item = getMsgSentElement(elem)
                    flag = 1;
                    str+=item[0].outerHTML;
               }
               else {
                   var item = getMsgReceivedElement(elem, flag)
                   flag = 0;
                   str+=item[0].outerHTML;
               }
           })
           settings.mssgContainer.prepend(str)

           if($(window).outerWidth() < 769 ) {
               settings.backButtonChat.removeClass("hidden")
               settings.candImage.removeClass("hidden")
               settings.conversationList.addClass("hidden")
           }
           $('.loading.loaderScroller.second').addClass("hidden")
           settings.chatWindow.removeClass("hidden")
           settings.userProfile.removeClass("hidden")
           initializeTooltip()

   }

   function onClickBackButton() {
       settings.backButtonChat.click(function(){
           settings.channelName = ""
           settings.backButtonChat.addClass("hidden")
           settings.candImage.addClass("hidden")
           settings.chatWindow.addClass("hidden")
           settings.userImg.attr("src", ("/static/images/noimage.png"));
           settings.userName.text("Your Chats!");
           settings.conversationList.removeClass("hidden")
       })
   }

   function onSendMessage(fn) {
       settings.sendMsg.click(function() {
           var eventObj = {
               event_category: eventMap["sendMsg"]["cat"],
               event_label: 'origin=MyChats,recId='+recruiterId+''
           }
           sendEvent(eventMap["sendMsg"]["event"], eventObj)
           var message =  (settings.msgContent.val()).trim();
           if(message == '') {
               return settings.msgContent.val("")
           }
           fn(message, settings.channelName, settings.candidateId)
       })
       settings.msgContent.keypress(function(event) {
           var eventObj = {
               event_category: eventMap["sendMsg"]["cat"],
               event_label: 'origin=MyChats,recId='+recruiterId+''
           }
           sendEvent(eventMap["sendMsg"]["event"], eventObj)
           if(event.which == 13 && !event.shiftKey) {
               var message = ($(this).val()).trim();
               if(message == '') {
                   return $(this).val("")
               }
               fn(message, settings.channelName, settings.candidateId)
           }
       })
   }

   function appendSendMessage(message, pic) {
       var elem = {}
       elem.entry = {}
       elem.entry.msg = message;
       elem.entry.time = parseInt(moment().format('x'))
       elem.entry.img = pic
       var item = getMsgSentElement(elem)
       settings.mssgContainer.append(item)
       initializeTooltip()
       scrollToBottom()
       settings.msgContent.val('');
   }

   function receiveMessage(msg, channelName) {
       if(settings.channelName == channelName) {
           var elem = {}
           elem.entry = {}
           elem.entry.msg = msg.msg;
           elem.entry.time = msg.time;
           elem.entry.img = msg.img;
           var item = getMsgReceivedElement(elem)
           settings.mssgContainer.append(item)
           initializeTooltip()
           scrollToBottom()
           return
       }
       addNewMessageNotification(channelName)
   }

   function addNewMessageNotification(channelName) {

       var elem = settings.conversationItemList.find(".conversationItem[data-channel-name="+channelName+"] .newMsgNotify");
       var msgCount = elem.attr("data-count");
       msgCount = parseInt(msgCount) + 1;
       elem.attr("data-count", msgCount);
       elem.text(msgCount).removeClass("hidden")
   }

   function showStatusIcon(channelName) {
       $(".conversationItem[data-channel-name="+channelName+"]").find(".candStatus").removeClass("hidden")
   }

   function hideStatusIcon(channelName) {
       $(".conversationItem[data-channel-name="+channelName+"]").find(".candStatus").addClass("hidden")
   }

   function scrollToBottom() {

       $(".current-chat").scrollTop(jQuery("#mssgContainer").outerHeight());
   }

   function setUuid(uuid) {
       settings.uuid = uuid
   }

   function setRecruiterActive() {
       settings.isOnline.removeClass("not-active")
       settings.isActive.text("Active Now");
   }

   function setRecruiterInactive() {
       settings.isOnline.addClass("not-active")
       settings.isActive.text("Not Active");
   }

   function hideCandidateBlocks() {
       settings.chatWindow.addClass("hidden");
       settings.userProfile.addClass("hidden");
   }

   return {
       init: init,
       setConfig : setConfig,
       addToList: addToList,
       onClickSingleChatItem: onClickSingleChatItem,
       setCandidateProfile: setCandidateProfile,
       populateMessages: populateMessages,
       onSendMessage: onSendMessage,
       receiveMessage: receiveMessage,
       showStatusIcon: showStatusIcon,
       hideStatusIcon: hideStatusIcon,
       onInputSearchCandidate: onInputSearchCandidate,
       appendSendMessage: appendSendMessage,
       setUuid: setUuid,
       scrollToBottom: scrollToBottom,
       setRecruiterActive: setRecruiterActive,
       setRecruiterInactive: setRecruiterInactive,
       setChat: setChat,
       hideCandidateBlocks: hideCandidateBlocks
   }

   function initializeTooltip() {
        if(window.innerWidth<=768){
            $(".chat-body").find(".tooltip").not(".prototype .tooltip").tooltipster({
            animation: 'fade',
            delay: 0,
            side:['bottom'],
            theme: 'tooltipster-borderless',
            trigger:'click'
            })
        }
        else{
            $(".chat-body").find(".tooltip").not(".prototype .tooltip").tooltipster({
                animation: 'fade',
                delay: 0,
                side:['bottom'],
                theme: 'tooltipster-borderless'
            })
        }
    }

}
