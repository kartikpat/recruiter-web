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
        settings.candidateItemShell= $(".candidateItem.shell"),
        settings.status= "1,3",
        settings.jobId= -1,
        settings.jobTitle = ""
        onToggleJobList();
        jQuery(".header .menu-list-item.my-jobs").addClass("active");
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

       var tagStr = '';
       $.each(aData["tags"],function(index, aTag) {
           var tag =  $(""+settings.candTagItemClass+".prototype").clone().removeClass("prototype hidden");
           tag.find("a").text(aTag["name"]).attr("href","/recruiter/tagged-candidates?queryTag="+aTag["id"]+"");
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
       if(aData["applications"]) {
           if(aData["applications"].length > 1) {
               item.candJobList.addClass("hidden")
               item.multipleJobListingText.text("Applied to "+aData["applications"].length+" jobs")
               var str = ""
               $.each(aData["applications"],function(index, application) {
                   console.log(application)
                   var item =  $(''+settings.candAppliedJobsClass+'.prototype').clone().removeClass("prototype hidden");;
                   item.html(application["title"] + " -<a href='/job/"+application["jobID"]+"/applications/"+application["id"]+"'> View Profile</a> ")
                   str+=item[0].outerHTML
               })
               item.multipleCandJobListing.append(str);
               item.multipleCandJobListContainer.removeClass("hidden");
           }
           else if(aData["applications"].length == 1) {
               console.log(aData["applications"][0])
               item.jobTitle.text(aData["applications"][0]["title"])
               item.candidateViewProfileLink.attr("href", "/job/"+aData["applications"][0]["jobID"]+"/applications/"+aData["applications"][0]["id"]+"")
           }
       }
       else {
            item.jobTitle.text(settings.jobTitle)
            item.candidateViewProfileLink.attr("href", "/job/"+settings.jobId+"/applications/"+aData["id"]+"")
       }
       if(aData["pro"]) {
           item.isProMember.removeClass("hidden")
       }
       if(aData["follow"]) {
           item.isFollowedUp.removeClass("hidden")
       }
       return item
   }

   function showCandidateCount(count) {
       settings.candidateCount.text(count)
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
           return settings.candidateListing.append("<div class='no-data'>No more records!</div>")
       }
   }

   function emptyCandidateList() {
       settings.candidateListing.empty();
   }

   function onFilterByStatus(fn) {
       settings.filterByStatus.change(function(){
           var status = $(this).val();
           settings.status = status;
           return fn();
       })
   }

   function onFilterByJob(fn) {
       settings.filterByJob.change(function(){
           var jobId = $(this).val();
           settings.jobId = jobId;
           settings.jobTitle = $(this).find("option:selected").text();
           return fn();
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

   function getAppliedFilters() {
       var parameters = {}
       parameters.status = settings.status;
       parameters.jobId = settings.jobId;
       return parameters;
   }

   return {
       init: init,
       addToList: addToList,
       setConfig : setConfig,
       emptyCandidateList: emptyCandidateList,
       onFilterByStatus: onFilterByStatus,
       onFilterByJob: onFilterByJob,
       populateJobsDropdown: populateJobsDropdown,
       showCandidateCount: showCandidateCount,
       getAppliedFilters: getAppliedFilters,
       showShell: showShell
   }

}
