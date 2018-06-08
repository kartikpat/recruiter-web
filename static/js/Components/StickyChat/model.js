function ChatSticky() {

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
       settings.userImg= $("#userImg"),
       settings.userOrg= $("#userOrg"),
       settings.userDes= $("#userDes"),
       settings.userPhone= $("#userPhone"),
       settings.userLoc= $("#userLoc"),
       settings.userExp= $("#userExp"),
       settings.conversationItemClass = ".conversationItem",
       settings.mssgContainer = $("#mssgContainer"),
       settings.recruiterFullName = "",
       settings.channelName = ""

   }

   function onInputSearchCandidate(fn) {
       settings.searchCandidate.on('input',function(){
           var str = $(this).val();
          	str=str.toLowerCase();
            fn(str)
       })
   }

   function getElement(id) {
       var card = $(".candidateCard.prototype").clone().removeClass('prototype hidden')
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
       var item = getElement(aData["id"]);
       item.name.text(aData["name"]);
       item.designation.text(aData["name"]);
       item.element.attr("data-channel-name", aData["name"]);
       return item
   }


   function addToList(dataArray){
       var str = '';
       if(!dataArray.length) {
           return settings.conversationItemList.html("<div class='no-data'>No Candidate Found!</div>")
       }
       dataArray.forEach(function(aData, index){
           var item = createElement(aData);
           str+=item.element[0].outerHTML;

       });
       settings.conversationItemList.html(str);
   }

   function setProfile(obj) {
       settings.recruiterName.text(obj["name"]);
       settings.recruiterFullName = obj["name"]
   }

   function setCandidateProfile(obj) {
       settings.userImg.attr("src", (obj["img_link"] || "/static/images/noimage.png"));
       settings.userName.text(obj["name"]);
       settings.userPhone.text(obj["phone"]);
       settings.userDes.text(obj["desg"]);
       settings.userOrg.text(obj["org"]);
       settings.userLoc.text(obj["location"]);
   }

   function onClickSingleChatItem(fn) {
       settings.conversationItemList.on('click', settings.conversationItemClass, function(){
           if(settings.channelName == channelName ) {
               return
           }
           var channelName = $(this).attr("data-channel-name");
           var candidateId = $(this).attr("data-candidate-id");
           settings.msgContent.attr("data-channel-name",channelName)
           settings.channelName = channelName
           fn(candidateId)
       })
   }

   function getTimeElement(data) {
       var card = $(".timeSeperator.prototype").clone().removeClass('prototype hidden')
       if(moment(data["entry"]["time"]).format("YYYY MM DD") == moment().format("YYYY MM DD")) {
           card.text("Today");
       }
       else {
           card.text(moment(data["entry"]["time"]).format("YYYY MM DD"))
       }
       return card
   }

   function getMsgSentElement(data) {
       console.log(data)
       var card = $(".message.sent.prototype").clone().removeClass('prototype hidden')
       card.find(".useImg").attr("src", data["img"])
       card.find(".msgContent").html(data["entry"]["msg"])
       card.find(".msgTime").text(moment(data["entry"]["time"]).format("hh:mm a"))
       return card
   }

   function getMsgReceivedElement(data) {
       var card = $(".message.received.prototype").clone().removeClass('prototype hidden')
       card.find(".useImg").attr("src", data["img"])
       card.find(".msgContent").html(data["entry"]["msg"])
       card.find(".msgTime").text(moment(data["entry"]["time"]).format("hh:mm a"))
       return card
   }

   function populateMessages(dataArray) {
        settings.mssgContainer.empty()
        var str = ""
        dataArray.forEach(function(elem, index){
               if(index == 0 || (index > 0 && (moment(dataArray[index - 1]["entry"]["time"]).format("YYYY MM DD") != moment(elem["entry"]["time"]).format("YYYY MM DD"))) ) {
                   var item = getTimeElement(elem)
                   str+=item[0].outerHTML;
               }
               if(elem["entry"]["name"] == settings.recruiterFullName ){
                   var item = getMsgReceivedElement(elem)
                   str+=item[0].outerHTML;
               }
               else {
                   var item = getMsgSentElement(elem)
                   str+=item[0].outerHTML;
               }
           })
           settings.mssgContainer.append(str)
        //    scrollToBottom();
   }

   function onSendMessage(fn) {
       settings.sendMsg.click(function(){
           var message =  settings.msgContent.val();
           var channelName = settings.msgContent.attr("data-channel-name");
           var elem = {}
           elem.entry = {}
           elem.entry.msg = message;
           elem.entry.time = parseInt(moment().format('x'))
           var item = getMsgSentElement(elem)
           settings.mssgContainer.append(item)
           settings.msgContent.val('');
           fn(message, channelName)
       })
    //    settings.msgContent.keypress(function(event){
    //        if(event.which == 13) {
    //            var message = $(this).val();
    //            var elem = {}
    //            elem.entry.mssg = message;
    //            elem.entry.time = moment().format('x')
    //            var item = getMsgSentElement(elem)
    //            settings.mssgContainer.append(item)
    //            fn(message)
    //        }
    //    })
   }

   function receiveMessage(msg, channelName) {
       var elem = {}
       elem.entry = {}
       elem.entry.msg = msg.msg;
       elem.entry.time = msg.time;
       elem.img = msg.img;
       var item = getMsgReceivedElement(elem)
       settings.mssgContainer.append(item)
   }

   function showStatusIcon(channelName) {
       $(".conversationItem[data-channel-name="+channelName+"]").find(".candStatus").removeClass("hidden")
   }

   function hideStatusIcon(channelName) {
       $(".conversationItem[data-channel-name="+channelName+"]").find(".candStatus").addClass("hidden")
   }

   // var scrollToBottom = function () {
   //     settings.mssgContainer.scrollTop(settings.mssgContainer[0].scrollHeight);
   // }

   
   return {
       init: init,
       setConfig : setConfig,
       addToList: addToList,
       setProfile: setProfile,
       onClickSingleChatItem: onClickSingleChatItem,
       setCandidateProfile: setCandidateProfile,
       populateMessages: populateMessages,
       onSendMessage: onSendMessage,
       receiveMessage: receiveMessage,
       showStatusIcon: showStatusIcon,
       hideStatusIcon: hideStatusIcon,
       onInputSearchCandidate: onInputSearchCandidate
   }

}
