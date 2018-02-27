function candidateList() {

    var settings = {};
    var config = {};

    function init() {
        settings.candidateListing= $("#candidateList"),
        settings.filterByStatus= $('#filterByStatus'),
        settings.filterByJob= $('#filterByJob'),
        settings.candidateCount= $('#candidateCount'),
        settings.candidateItemClass= ".candidateItem",
        settings.candidateDownloadResumeButtonClass= ".candDownloadResume",
        settings.candidateProfessionalItemClass = '.candProfessionalItem',
        settings.candidateEducationItemClass = '.candEducationItem',
        settings.candTagItemClass= '.candTagItem',
        settings.candJobOption= '.candJobOption',
        settings.multipleJobListingClass= '.multipleJobListing',
        settings.multipleJobListingTextClass= '.multipleJobListingText',
        settings.candAppliedJobsClass= '.candAppliedJobs',
        settings.candidateItemShell= $(".candidateItem.shell")


        onToggleJobList();
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
           isOnline: card.find('.candidateStatus'),
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
           downloadResumeButton: card.find(settings.candidateDownloadResumeButtonClass),
           candJobList: card.find('.jobListing'),
           multipleCandJobListContainer: card.find('.multipleJobListingContainer'),
           multipleJobListingText: card.find('.multipleJobListingText'),
           multipleCandJobListing: card.find('.multipleJobListing'),
           jobTitle: card.find('.jobTitle')
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
       item.image.attr("src",(aData["img"] || "/static/images/noimage.png"));
       item.name.text(aData["name"] || "NA");
       item.experience.text((aData["exp"]["year"] + "y" + " " + aData["exp"]["month"] + "m") || "NA");
       item.location.text(aData["currentLocation"] || "NA");
       item.appliedOn.text(moment(aData["timestamp"], "x").format('DD-MM-YYYY'))
       item.notice.text((aData["notice"] + " months"));
       item.downloadResumeButton.attr("href", aData["resume"])
       item.downloadResumeButton.attr("download", aData["name"].replace(/ +/g, '_')+'_resume.pdf')

       var tagStr = '';
       $.each(aData["tags"],function(index, aTag) {
           var tag =  $(""+settings.candTagItemClass+".prototype").clone().removeClass("prototype hidden");
           tag.find("a").text(aTag["name"]).attr("href","/tagged-candidates/334895?queryTag="+aTag["id"]+"");
           tagStr+=tag[0].outerHTML
       })
       item.candTagList.html(tagStr)
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
       if(aData["tags"].length > 1) {
           item.candJobList.addClass("hidden")
           item.multipleJobListingText.text("Applied to "+aData["tags"].length+" jobs")
           var str = ""
           $.each(aData["tags"],function(index, aTag) {
               var item =  $(''+settings.candAppliedJobsClass+'.prototype').clone().removeClass("prototype hidden");;
               item.text(aTag["name"])
               str+=item[0].outerHTML
           })
           item.multipleCandJobListing.append(str);
           item.multipleCandJobListContainer.removeClass("hidden");
       }
       else {
           item.jobTitle.text(aData["name"])
       }
       if(aData["pro"]) {
           item.proMember.removeClass("hidden")
       }
       if(aData["follow"]) {
           item.isFollowedUp.removeClass("hidden")
       }
       return item
   }

   function showCandidateCount(count) {
       settings.candidateCount.text(count)
   }

   function addToList(dataArray){
       var str = '';
       dataArray.forEach(function(aData, index){
           var item = createElement(aData);
           str+=item.element[0].outerHTML;
       });
       hideShell()
       settings.candidateListing.append(str);
   }

   function emptyCandidateList() {
       settings.candidateListing.empty();
   }

   function onFilterByStatus(fn) {
       settings.filterByStatus.change(function(){
           var status = $(this).val();
           return fn(status);
       })
   }

   function onFilterByJob(fn) {
       settings.filterByJob.change(function(){
           var jobId = $(this).val();
           return fn(jobId);
       })
   }

   function getJobFitersElement() {
       var card = $(""+settings.candJobOption+".prototype").clone().removeClass("prototype hidden");
       return {
           element : card
       }
   }

   function populateJobsDropdown(dataArray) {
       var str = '';
       dataArray.forEach(function(aData, index){
           var item = getJobFitersElement(aData);
           item.element.text(aData["title"]);
           item.element.val(aData["publishedId"]);
           str+=item.element[0].outerHTML;
       });
       settings.filterByJob.append(str);
   }

   function onToggleJobList() {
       settings.candidateListing.on('click',settings.multipleJobListingTextClass, function(){
           $(this).next().slideToggle();
       })
   }

   function hideShell() {
       settings.candidateItemShell.addClass("hidden")
   }

   function showShell() {
       settings.candidateItemShell.removeClass("hidden")
   }


   return {
       init: init,
       addToList: addToList,
       setConfig : setConfig,
       emptyCandidateList: emptyCandidateList,
       onFilterByStatus: onFilterByStatus,
       onFilterByJob: onFilterByJob,
       populateJobsDropdown: populateJobsDropdown,
       showCandidateCount: showCandidateCount
   }

}
