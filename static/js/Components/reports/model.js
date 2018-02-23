function reportList() {

    var settings = {};
    var config = {};

    function init() {
        settings.downloadExcelButton= $("#downloadExcel"),
        settings.searchCandidateInput= $('#searchCandidate'),
        settings.searchCandidateButton= $("#searchCandidateButton"),
        settings.reportsTable = $("#reportsTable"),
        settings.reportRowClass= ".reportRow",
        settings.candidateDownloadResumeButtonClass= ".candDownloadResume",
        settings.candidateProfessionalItemClass = '.candProfessionalItem',
        settings.candidateEducationItemClass = '.candEducationItem',
        settings.candTagItemClass= '.candTagItem'
   }

   function setConfig(key, value) {
       config[key] = value;
   }

   function getElement(id) {
       var card = $(""+settings.reportRowClass+".prototype").clone().removeClass('prototype hidden')
       debugger
    //    card.attr('data-candidate-id', id);
       return {
           element: card
        //    image: card.find('.candImage'),
        //    isOnline: card.find('.candStatus')
        //    name: card.find('.candName'),
        //    experience: card.find('.candExperience'),
        //    location: card.find('.candCurrentLocation'),
        //    appliedOn: card.find('.candAppliedOn'),
        //    notice: card.find('.candNotice'),
        //    candTagList: card.find('.candTagListing'),
        //    eduList: card.find('.candEducationList'),
        //    profList: card.find('.candProfessionalList'),
        //    isProMember: card.find('.isProMember'),
        //    isFollowedUp: card.find('.isFollowedUp'),
        //    downloadResumeButton: card.find(settings.candidateDownloadResumeButtonClass)
       }
   }

   // function getEducationElement() {
   //     var card = $(''+settings.candidateEducationItemClass.prototype+'.prototype').clone().removeClass("prototype hidden");
   //     return {
   //         element: card,
   //         name: card.find('.instituteName'),
   //         batch: card.find('.candBatch'),
   //         degree: card.find('.candDegree')
   //     }
   // }
   //
   // function getProfessionalElement() {
   //     var card = $(''+settings.candidateProfessionalItemClass.prototype+'.prototype').clone().removeClass("prototype hidden");
   //     return {
   //         element: card,
   //         name: card.find('.companyName'),
   //         tenure: card.find('.candTenure'),
   //         designation: card.find('.candDesignation')
   //     }
   // }

   function createElement(aData) {
       var item = getElement(1);
       debugger
    //    item.element.attr("data-application-id", aData["id"]);
    //    item.image.attr("src",(aData["img"] || "/static/images/noimage.png"));
    //    item.name.text(aData["name"] || "NA");
    //    item.experience.text((aData["exp"]["year"] + "y" + " " + aData["exp"]["month"] + "m") || "NA");
    //    item.location.text(aData["currentLocation"] || "NA");
    //    item.appliedOn.text(moment(aData["timestamp"], "x").format('DD-MM-YYYY'))
    //    item.notice.text((aData["notice"] + " months"));
    //    item.downloadResumeButton.attr("href", aData["resume"])
    //    item.downloadResumeButton.attr("download", aData["name"].replace(/ +/g, '_')+'_resume.pdf')
       //
    //    var tagStr = '';
    //    $.each(aData["tags"],function(index, aTag) {
    //        var tag =  $(""+settings.candTagItemClass+".prototype").clone().text(aTag["name"]).removeClass("prototype hidden");
    //        tagStr+=tag[0].outerHTML
    //    })
    //    item.candTagList.html(tagStr)
    //    var profStr = '';
    //    $.each(aData["jobs"],function(index, anObj) {
    //        if(index > 2) {
    //            return
    //        }
    //        var item = getProfessionalElement()
    //        item.name.text(anObj["organization"])
    //        item.designation.text(anObj["designation"]);
       //
    //        var fromMon = getMonthName(anObj["exp"]["from"]["month"]);
    //        var toMon = getMonthName(anObj["exp"]["to"]["month"]);
    //        var fromYear = anObj["exp"]["from"]["year"];
    //        var toYear = anObj["exp"]["from"]["year"];
    //        var str = (anObj["is_current"]) ? fromMon + " - " + fromYear + " to Present": fromMon + " - " + fromYear + " to " + toMon + " - " + toYear;
    //        item.tenure.text(str);
       //
    //        profStr+=item.element[0].outerHTML
    //    })
    //    item.profList.html(profStr)
    //    var eduStr = '';
    //    $.each(aData["education"],function(index, anObj) {
    //        if(index > 2) {
    //            return
    //        }
    //        var item = getEducationElement()
    //        item.name.text(anObj["institute"])
    //        item.batch.text(anObj["batch"]["from"] + " - " + anObj["batch"]["to"] )
    //        item.degree.text(anObj["degree"] + "("+anObj["courseType"]+")")
    //        eduStr+=item.element[0].outerHTML
    //    })
    //    item.eduList.html(eduStr)
    //    if(aData["pro"]) {
    //        item.proMember.removeClass("hidden")
    //    }
    //    if(aData["follow"]) {
    //        item.isFollowedUp.removeClass("hidden")
    //    }
       return item
   }

   function addToList(){
       var str = '';
       dataArray = ["1","2"]
       dataArray.forEach(function(aData, index){
           var item = createElement(aData);
           str+=item.element[0].outerHTML;
       });
       settings.reportsTable.append(str);
   }

   function emptyCandidateList() {
       settings.candidateListing.empty();
   }

   return {
       init: init,
       addToList: addToList,
       setConfig : setConfig,
       emptyCandidateList: emptyCandidateList
   }

}
