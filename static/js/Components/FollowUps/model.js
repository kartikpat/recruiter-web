function candidateList() {

    var settings = {};
    var config = {};

    function init() {
        settings.candidateListing= $("#candidateListing"),
        settings.filterByTagList= $('#filterByTagList'),
        settings.candidateItemClass= ".candidateItem",
        settings.candidateDownloadResumeButtonClass= ".candDownloadResume",
        settings.candidateProfessionalItemClass = '.candProfessionalItem',
        settings.candidateEducationItemClass = '.candEducationItem',
        settings.candAppliedJobsClass= '.candAppliedJobs',
        settings.candTagItemClass= '.candTagItem',
        settings.tagOptionClass= '.tagOption',
        settings.tagId = -1,
        settings.candidateItemShell= $(".candidateItem.shell"),
        settings.candAppliedJobsClass= '.candAppliedJobs',
        settings.multipleJobListingClass= '.multipleJobListing',
        settings.multipleJobListingTextClass= '.multipleJobListingText',
        settings.candidateShortlistButtonClass='.candidateShortlist',
        settings.candidateRejectButtonClass= '.candidateReject';

   }

   function initializeDatePicker(fn) {
       $( "#datepicker" ).datepicker({
           showOn: "button",
           buttonImage: '/static/images/smallcalendar.svg',
           buttonImageOnly: true,
           changeMonth: true,
           changeYear: true,
           dateFormat: 'yy-mm-dd',
           onSelect: function(){
               
               var fromDate = $(this).val();

               fn(fromDate);
           }

       });
   }

   function setConfig(key, value) {
       config[key] = value;
   }

   function getElement(id) {
       var card = $(""+settings.candidateItemClass+".prototype").clone().removeClass('prototype hidden')
       card.attr('data-candidate-id', id);
       return {
           element: card,
           image: card.find('.candImage'),
           isOnline: card.find('.candStatus'),
           name: card.find('.candName'),
           experience: card.find('.candExperience'),
           location: card.find('.candCurrentLocation'),
           appliedOn: card.find('.candAppliedOn'),
           notice: card.find('.candNotice'),
           candTagList: card.find('.candTagListing'),
           eduList: card.find('.candEducationList'),
           profList: card.find('.candProfessionalList'),
           isProMember: card.find('.isProMember'),
           isFollowedUp: card.find('.isFollowedUp'),
           shortlistButton: card.find(settings.candidateShortlistButtonClass),
           rejectButton: card.find(settings.candidateRejectButtonClass),
           downloadResumeButton: card.find(settings.candidateDownloadResumeButtonClass),
           candJobList: card.find('.jobListing'),
           multipleCandJobListContainer: card.find('.multipleJobListingContainer'),
           multipleJobListingText: card.find('.multipleJobListingText'),
           multipleCandJobListing: card.find('.multipleJobListing'),
           jobTitle: card.find('.jobTitle'),
           candidateViewProfileLink: card.find('.candidateViewProfile')
       }
   }

   function getEducationElement() {
       var card = $(''+settings.candidateEducationItemClass+'.prototype').clone().removeClass("prototype hidden");
       return {
           element: card,
           name: card.find('.instituteName'),
           batch: card.find('.candBatch'),
           degree: card.find('.candDegree')
       }
   }

   function getProfessionalElement() {
       var card = $(''+settings.candidateProfessionalItemClass+'.prototype').clone().removeClass("prototype hidden");
       return {
           element: card,
           name: card.find('.companyName'),
           tenure: card.find('.candTenure'),
           designation: card.find('.candDesignation')
       }
   }

   function createElement(aData) {
       var item = getElement(aData["userID"]);
       item.element.attr("data-application-id", aData["id"]);
       item.element.attr("data-job-id", aData["jobId"]);
       item.image.attr("src",(aData["img"] || "/static/images/noimage.png"));
       item.name.text(aData["name"] || "NA");
       item.experience.text((aData["exp"]["year"] + "y" + " " + aData["exp"]["month"] + "m") || "NA");
       item.location.text(aData["currentLocation"] || "NA");
       item.appliedOn.text(moment(aData["timestamp"], "x").format('DD-MM-YYYY'))
       if(aData["notice"] == 7) {
           item.notice.text("Immediately Available");
       }
       else if(aData["notice"] == 1) {
           item.notice.text((aData["notice"] + " month"));
       }
       else {
           item.notice.text((aData["notice"] + " months"));
       }
       item.downloadResumeButton.attr("href", aData["resume"])
       item.downloadResumeButton.attr("download", aData["name"].replace(/ +/g, '_')+'_resume.pdf')
       var status = aData["status"];
       item.shortlistButton.attr("data-status", status);
       item.rejectButton.attr("data-status", status);

       if(status == 1) {
           item.shortlistButton.text("Shortlisted");
       }
       else if(status == 2) {
           item.rejectButton.text("Rejected");
       }

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
           item.batch.text(anObj["batch"]["from"] + " - " + anObj["batch"]["to"] )
           item.degree.text(anObj["degree"] + "("+anObj["courseType"]+")")
           eduStr+=item.element[0].outerHTML
       })
       item.eduList.html(eduStr)

       item.jobTitle.text(aData["title"])
       item.candidateViewProfileLink.attr("href", "/job/"+aData["jobId"]+"/applications/"+aData["id"]+"")

       if(aData["pro"]) {
           item.isProMember.removeClass("hidden")
       }

       return item
   }

   function addToList(dataArray, pageNumber, pageContent){

       hideShell()
       if(dataArray.length<1 && pageNumber ==1) {
           return settings.candidateListing.append("<div class='no-data'>No Applications Found!</div>")
       }
       var str = '';
       dataArray.forEach(function(aData, index){
           var item = createElement(aData);
           str+=item.element[0].outerHTML;
       });
       settings.candidateListing.append(str);
       if(dataArray.length< pageContent) {
           return settings.candidateListing.append("<div class='no-data'>You have reached the end of the list</div>")
       }
   }

   function emptyCandidateList() {
       settings.candidateListing.empty();
   }


   function hideShell() {
       settings.candidateItemShell.addClass("hidden")
   }

   function showShell() {
       settings.candidateItemShell.removeClass("hidden")
   }

   function onClickShortlistCandidate(fn) {
       settings.candidateListing.on('click', settings.candidateShortlistButtonClass, function(event) {

           var applicationId = $(this).closest(settings.candidateItemClass).attr("data-application-id")
           var jobId = $(this).closest(settings.candidateItemClass).attr("data-job-id")
           fn(applicationId, jobId);

       })
   }

   function onClickRejectCandidate(fn) {
       settings.candidateListing.on('click', settings.candidateRejectButtonClass, function(event) {
            var applicationId = $(this).closest(settings.candidateItemClass).attr("data-application-id")
           var jobId = $(this).closest(settings.candidateItemClass).attr("data-job-id")
           fn(applicationId, jobId);

       })
   }

   function candidateActionTransition(arr) {
       arr.forEach(function(applicationId){
           settings.candidateListing.find(".candidateItem[data-application-id="+applicationId+"]").slideUp("normal", function() {
                $(this).remove();
            })
       })
   }

   return {
       init: init,
       addToList: addToList,
       setConfig : setConfig,
       emptyCandidateList: emptyCandidateList,
       showShell: showShell,
       onClickShortlistCandidate: onClickShortlistCandidate,
       onClickRejectCandidate: onClickRejectCandidate,
       candidateActionTransition: candidateActionTransition,
       initializeDatePicker: initializeDatePicker
   }

}
