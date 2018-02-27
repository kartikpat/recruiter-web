var obj = {
   "data": [
       {
           "id": 530185,
           "title": "Data Analyst (5-7 yrs)",
           "status": "unpublished",
           "views": 3,
           "createdAt": "2018-01-29T10:18:07.000Z",
           "total": 0,
           "rejected": 0,
           "save": 0,
           "shortlisted": 0,
           "reviewed": 0,
           "premium": 1
       },
       {
           "id": 530187,
           "title": "hr manager (3-5 yrs)",
           "status": "unpublished",
           "views": 0,
           "createdAt": "2018-02-14T19:53:12.000Z",
           "total": 0,
           "rejected": 0,
           "save": 0,
           "shortlisted": 0,
           "reviewed": 0
       },
       {
           "id": 334895,
           "title": "iimjobs.com - Product Manager - Internet/Mobile (0-3 yrs)",
           "status": "unpublished",
           "views": 3399,
           "createdAt": "2016-05-12T10:53:42.000Z",
           "total": 197,
           "rejected": 107,
           "save": 6,
           "shortlisted": 44,
           "reviewed": 40,
           "premium": 1
       }
   ],
   "status": "success"
}

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

   function getApplicationLink(defaultTab, jobId) {
       return "candidate-apply-list/"+jobId+"?defaultTab="+defaultTab+"";
   }

   function createElement(aData) {
       var item = getElement();
       item.element.attr("data-application-id", aData["id"]);
       item.publishedOn.text(moment(aData["createdAt"]).format('ll'));
       item.jobTitle.text(getTitleFormat(aData["title"], (/\(\d+-\d+ \w+\)$/)));
       // item.experience.text((aData["exp"]["year"] + "y" + " " + aData["exp"]["month"] + "m") || "NA");
       // item.location.text(aData["currentLocation"] || "NA");
       item.postingViews.text(aData["views"]);
       item.allCandidates.text(aData["total"]).attr("href", getApplicationLink(0, aData["id"]));
       item.shortlistedCandidates.text(aData["shortlisted"]).attr("href", getApplicationLink(3, aData["id"]));
       item.rejectedCandidates.text(aData["rejected"]).attr("href", getApplicationLink(4, aData["id"]));
       item.savedCandidates.text(aData["saved"]).attr("href", getApplicationLink(5, aData["id"]));
       item.resumeViewedCount.text(aData["saved"]).attr("href", getApplicationLink(2, aData["id"]));
       item.resumeDownloadedCount.text(aData["saved"]).attr("href", getApplicationLink(2, aData["id"]));
       item.jobCurrentStatus.text(aData["status"]);
       item.isJobPremium.text(binary[aData["premium"]])
       return item
   }

   function addToList(){
       var str = '';
       dataArray = obj["data"];
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

   return {
       init: init,
       addToList: addToList,
       setConfig : setConfig
   }
}

var binary = {
    1: "Yes",
    0: "No"
}
