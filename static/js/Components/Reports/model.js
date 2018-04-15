function reportList() {

    var settings = {};
    var config = {};

    function init() {
        settings.downloadExcelButton= $("#downloadExcel"),
        // settings.searchCandidateInput= $('#searchCandidate'),
        // settings.searchCandidateButton= $("#searchCandidateButton"),
        settings.reportsTable = $("#reportsTable"),
        settings.reportRowClass= ".reportRow",
        settings.candidateDownloadResumeButtonClass= ".candDownloadResume",
        settings.candidateProfessionalItemClass = '.candProfessionalItem',
        settings.candidateEducationItemClass = '.candEducationItem',
        settings.candTagItemClass= '.candTagItem',
        settings.reportRowShell = $(".reportRo.shell")
        settings.emptyView=$('.empty-screen'),
        settings.header=$('.head')
        settings.button=$('.white')
        jQuery(".header .menu-list-item.reports").addClass("active");
   }

   function setConfig(key, value) {
       config[key] = value;
   }

   function getElement() {
       var card = $(""+settings.reportRowClass+".prototype").clone().removeClass('prototype hidden');
       return {
           element: card,
           publishedOn: card.find('.publishedOn'),
           jobTitle: card.find('.jobTitle'),
           postedBy: card.find('.postedBy'),
           postingViews: card.find('.postingViews'),
           allCandidates: card.find('.allCandidates'),
           shortlistedCandidates: card.find('.shortlistedCandidates'),
           rejectedCandidates: card.find('.rejectedCandidates'),
           savedCandidates: card.find('.savedCandidates'),
           resumeViewedCount: card.find('.resumeViewedCount'),
           resumeDownloadedCount: card.find('.resumeDownloadedCount'),
           excelDownloadedCount: card.find('.excelDownloadedCount'),
           recruiterActions: card.find('.recruiterActions'),
           jobStatus: card.find('.jobStatus'),
           isJobPremium: card.find('.isJobPremium'),
           jobCurrentStatus: card.find('.jobCurrentStatus')
       }
   }

   function getTitleFormat(title, regex) {
       return title.replace(regex, '');
   }

   function getApplicationLink(status, jobId) {
       return "job/"+jobId+"/applications?status="+status+"";
   }

   function createElement(aData) {
       var item = getElement();
       item.element.attr("data-application-id", aData["id"]);
       item.publishedOn.text(moment(aData["createdAt"]).format('ll'));
       var str = aData["by"];
       var res = str.split(" ");
       item.jobTitle.text(aData["title"]).attr("href", "https://www.iimjobs.com/j"+aData["url"]+"");
       item.postedBy.text(aData["by"]).attr("href", "https://www.iimjobs.com/r/"+config["recruiterId"]+"-"+res[0]+"-"+res[1]+"");
       // item.experience.text((aData["exp"]["year"] + "y" + " " + aData["exp"]["month"] + "m") || "NA");
       // item.location.text(aData["currentLocation"] || "NA");
       item.postingViews.text(aData["views"]);
       item.allCandidates.text(aData["total"]).attr("href", getApplicationLink("", aData["id"]));
       item.shortlistedCandidates.text(aData["shortlisted"]).attr("href", getApplicationLink("1", aData["id"]));
       item.rejectedCandidates.text(aData["rejected"]).attr("href", getApplicationLink("2", aData["id"]));
       item.savedCandidates.text(aData["save"]).attr("href", getApplicationLink("3", aData["id"]));
       item.resumeViewedCount.text(aData["reviewed"]).attr("href", getApplicationLink("4,5", aData["id"]));
       item.resumeDownloadedCount.text(aData["download"] || 0).attr("href", getApplicationLink("4,5", aData["id"]));
       item.jobCurrentStatus.text(aData["status"] || "N/A");
       item.isJobPremium.text(binary[aData["premium"]])
       item.excelDownloadedCount.text(binary[aData["excelDownload"] || 0])
       return item
   }

   function addToList(dataArray){
       var str = '';
       if(dataArray.length==0){
            settings.emptyView.removeClass('hidden');
            settings.header.addClass('hidden');
            settings.button.addClass('hidden');
       }
       
       dataArray.forEach(function(aData, index){
           var item = createElement(aData);
           str+=item.element[0].outerHTML;
       });
       hideShells();
       settings.reportsTable.append(str);
   }

   function showShells() {
       settings.reportRowShell.removeClass("hidden");
   }

   function hideShells() {
       settings.reportRowShell.addClass("hidden");
   }



   function setHref() {
       settings.downloadExcelButton.attr("href", "http://13.126.92.102:8000/recruiter/"+config["recruiterId"]+"/reports-download");
   }

   return {
       init: init,
       addToList: addToList,
       setConfig : setConfig,
       setHref: setHref
   }
}

var binary = {
    1: "Yes",
    0: "No"
}
