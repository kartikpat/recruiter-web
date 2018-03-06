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
       settings.searchCandidate= $("#searchCandidate"),
       settings.conversationItemList= $("#conversationItemList"),
       settings.msgContent= $("#msgContent"),
       settings.sendMsg= $("#sendMsg"),
       settings.recruiterImg= $("#recruiterImg"),
       settings.recruiterOrg= $("#recruiterOrg"),
       settings.recruiterDes= $("#recruiterDes"),
       settings.recruiterPhone= $("#recruiterPhone"),
       settings.recruiterLoc= $("#recruiterLoc"),
       settings.recruiterExp= $("#recruiterExp")

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
       var item = getElement(aData["userID"]);
       item.element.attr("data-application-id", aData["id"]);
       item.image.attr("src",(aData["img"] || "/static/images/noimage.png"));
       item.name.text(aData["name"] || "NA");
       item.experience.text((aData["exp"]["year"] + "y" + " " + aData["exp"]["month"] + "m") || "NA");
       item.location.text(aData["currentLocation"] || "NA");
       item.appliedOn.text(moment(aData["timestamp"], "x").format('DD-MM-YYYY'))
       item.notice.text((aData["notice"] + " months"));
       item.shortlistButton.attr("data-status", "1");
       item.rejectButton.attr("data-status", "2");
       item.savedButton.attr("data-status", "3");
       item.downloadResumeButton.attr("href", aData["resume"])
       item.downloadResumeButton.attr("download", aData["name"].replace(/ +/g, '_')+'_resume.pdf')
       var status = aData["status"];
       if(status == 1) {
           item.shortlistButton.text("Shortlisted")
       }
       else if(status == 2) {
           item.rejectButton.text("Rejected")
       }
       else if(status == 3) {
           item.savedButton.text("Saved for later")
       }
       // var tagStr = '';
       // $.each(aData["tags"],function(index, aTag) {
       //     var tag =  settings.candidateTagsPrototype.clone().text(aTag["name"]).removeClass("prototype hidden");
       //     tagStr+=tag[0].outerHTML
       // })
       // item.jobTagList.html(tagStr)
       var profStr = '';
       $.each(aData["jobs"],function(index, anObj) {
           if(index > 2) {
               return
           }
           var item = getProfessionalElement()
           item.name.text(anObj["organization"])
           item.designation.text(anObj["designation"]);

           var fromMon = getMonthName(anObj["exp"]["from"]["month"]);
           var toMon = getMonthName(anObj["exp"]["to"]["month"]);
           var fromYear = anObj["exp"]["from"]["year"];
           var toYear = anObj["exp"]["from"]["year"];
           var str = (anObj["is_current"]) ? fromMon + " - " + fromYear + " to Present": fromMon + " - " + fromYear + " to " + toMon + " - " + toYear;
           item.tenure.text(str);

           profStr+=item.element[0].outerHTML
       })
       item.profList.html(profStr)
       var eduStr = '';
       $.each(aData["education"],function(index, anObj) {
           if(index > 2) {
               return
           }
           var item = getEducationElement()
           item.name.text(anObj["institute"])
           item.tenure.text(anObj["batch"]["from"] + " - " + anObj["batch"]["to"] )
           item.degree.text(anObj["degree"] + "("+anObj["courseType"]+")")
           eduStr+=item.element[0].outerHTML
       })
       item.eduList.html(eduStr)

       console.log(aData['userID']);
       item.candidateCheckbox.attr("id",aData["userID"]);
       item.candidateCheckboxLabel.attr("for",aData["userID"]);
       if(aData["pro"]) {
           item.proMember.removeClass("hidden")
       }
       if(aData["follow"]) {
           item.isFollowedUp.removeClass("hidden")
       }
       return item
   }


   function addToList(dataArray, status){
       var str = '';
       var element = $(".candidateListing[data-status-attribute='"+status+"']");
       hideShells(status);
       if(!dataArray.length) {
           return element.html("<div class='no-data'>No Applications Found!</div>")
       }
       dataArray.forEach(function(aData, index){
           var item = createElement(aData);
           str+=item.element[0].outerHTML;
           console.log(index)
       });
       element.append(str);
       settings.rowContainer.find(".candidate-select").removeClass("selected");
   }

   function setProfile(obj) {
       settings.recruiterImg.attr("src", (obj["img_link"] || "/static/images/noimage.png"));
       settings.recruiterName.text(obj["name"]);
       settings.recruiterPhone.text(obj["phone"]);
       settings.recruiterDes.text(obj["desg"]);

       settings.recruiterOrg.text(obj["org"]);
    //    settings.recruiterExp.val(obj["exp"])
       settings.recruiterLoc.text(obj["location"]);
   }

   return {
       init: init,
       setConfig : setConfig,
       addToList: addToList,
       setProfile: setProfile

   }

}
