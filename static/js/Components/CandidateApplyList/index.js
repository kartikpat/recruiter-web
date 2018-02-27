var globalParameters = {
    pageContent: 10,
    pageNumber: 1,
    status: "",
    orderBy: 1,
    initialLoad: 1,
    candidateListLength: null
}
var screenName = "candidate-apply-list";
jQuery(document).ready( function() {

    // fetching url parameters
    var defaultTab = parseInt(getQueryParameter("defaultTab"));

    // creating the instance of models
	var candidates = candidateList();
    var aCandidate = Candidate();
    var theJob = Job();
    var store = Store();
    var filters = Filters();

    //initializing the models

    filters.init();
    candidates.init();
    theJob.init();
    aCandidate.init();

    submitPageVisit(recruiterId, screenName, jobId);
    var pageVisitSubscriptionSuccess = pubsub.subscribe("pageVisitSuccess:"+screenName, onPageVisitUpdateSuccess)
    var pageVisitSubscriptionSuccess = pubsub.subscribe("pageVisitFail:"+screenName, onPageVisitUpdateFail)
    function onPageVisitUpdateSuccess(topic, data){
        console.log('page visit done');
    }
    function onPageVisitUpdateFail(topic, data){
        console.log('page visit error');
    }

    //setting config variables
    theJob.setConfig("availableCredits", profile["availableCredits"]);
    theJob.setConfig("baseUrlJob", baseUrlJob);
    $("#downloadExcelMass").attr('href', baseUrl+"/recruiter/"+recruiterId+"/jobs/"+jobId+"/applications/download/excel");

    filters.addFilterData('industry', industryTagsData);
    filters.addFilterData('functionalArea',functionalAreaTagsData)
    filters.addFilterData('institute', instituteTagsData)
    filters.addFilterData('currentLocation', currentLocationTagsData)
    filters.addFilterData('language', languageTagsData)
    filters.addFilterData('preferredLocation', prefeLocationTagsData);
    filters.onClickApplyFilterButton(function(name){
        candidates.showShells(globalParameters.status)
        candidates.removeCandidate(globalParameters.status)
        filters.setAppliedFilters(name);
        var parameters = filters.getAppliedFilters();
        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;
        parameters.status = globalParameters.status;
        return fetchJobApplications(jobId, parameters, recruiterId)
    });
    filters.onClickRemoveFilter(function(value,category,type){
        candidates.showShells(globalParameters.status)
        candidates.removeCandidate(globalParameters.status)
        filters.removeFilter(value,category,type);
        var parameters = filters.getAppliedFilters();
        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;
        parameters.status = globalParameters.status;
        return fetchJobApplications(jobId, parameters, recruiterId);
    })
    filters.onClickSearchButton(function(){
        candidates.showShells(globalParameters.status)
        candidates.removeCandidate(globalParameters.status)
        var parameters = filters.getAppliedFilters();
        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;
        parameters.status = globalParameters.status;
        fetchJobApplications(jobId, parameters, recruiterId);
    })
    filters.onSelectSortByOption(function(){
        candidates.showShells(globalParameters.status)
        candidates.removeCandidate(globalParameters.status)
        var parameters = filters.getAppliedFilters();
        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;
        parameters.status = globalParameters.status;
        return fetchJobApplications(jobId, parameters, recruiterId);
    })
    filters.onClickRemoveAllFilters(function(){
        candidates.showShells(globalParameters.status)
        candidates.removeCandidate(globalParameters.status)
        var parameters = filters.getAppliedFilters();
        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;
        parameters.status = globalParameters.status;
        return fetchJobApplications(jobId, parameters, recruiterId);
    })

    candidates.onClickCandidate(function(candidateId){
        var candidateDetails = store.getCandidateFromStore(candidateId);
        var status = globalParameters.status
        aCandidate.showCandidateDetails(candidateDetails,"", status);
    });
    candidates.onClickAddTag(function(candidateId) {
        var candidateDetails = store.getCandidateFromStore(candidateId);
        var status = globalParameters.status
        aCandidate.showCandidateDetails(candidateDetails, "tag" , status);
    })
    candidates.onClickAddComment(function(candidateId) {
        var candidateDetails = store.getCandidateFromStore(candidateId);
        var status = globalParameters.status
        aCandidate.showCandidateDetails(candidateDetails, "comment", status);
    })
    candidates.onClickViewComment(function(candidateId) {
        var candidateDetails = store.getCandidateFromStore(candidateId);
        var status = globalParameters.status
        aCandidate.showCandidateDetails(candidateDetails, "comment", status);
    })
    candidates.onClickViewTag(function(candidateId) {
        var candidateDetails = store.getCandidateFromStore(candidateId);
        var status = globalParameters.status
        aCandidate.showCandidateDetails(candidateDetails, "tag", status);
    })
    candidates.onClickSendMessage(function(candidateId){
        window.location.href = "/my-chat"
    })
    candidates.onChangeCandidateCheckbox(function(candidateId){
        // alert(candidateId)
    })
    candidates.initializeJqueryTabs(defaultTab, function(event, ui) {
        var status = candidates.activateStatsTab(event, ui)
        candidates.showShells(status);
        candidates.removeCandidate(globalParameters.status)
        var parameters = filters.getAppliedFilters();
        globalParameters.status = status;
        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;
        parameters.status = globalParameters.status;
        fetchJobApplications(jobId, parameters,recruiterId);
    })
    candidates.onClickSendInterviewInvite(function(candidateId, applicationId) {
        var defaultCalendarId = theJob.getDefaultCalendar();
        if(!defaultCalendarId)
            theJob.showCalendarMissingError();
        // if(!(defaultCalendarId && candidateId && applicationId ))
        //     return alert('Please provide all values');
        // postInterviewInvite()
    })
    candidates.onClickDownloadResume(function(){
        console.log("you can call track event")
    });
    candidates.onClickSaveCandidate(function(applicationId, newStatus){
         var parameters = {};
         parameters.oldStatus = globalParameters.status
         parameters.newStatus = newStatus
         parameters.isModalButton = false
         setCandidateAction(recruiterId, jobId, "save" , applicationId, {}, parameters);
     })
    candidates.onClickShortlistCandidate(function(applicationId, newStatus){
        var parameters = {};
        parameters.oldStatus = globalParameters.status
        parameters.newStatus = newStatus
        parameters.isModalButton = false
        setCandidateAction(recruiterId, jobId, "shortlist" , applicationId, {}, parameters);
    })
    candidates.onClickRejectCandidate(function(applicationId, newStatus){
        var parameters= {};
        parameters.oldStatus = globalParameters.status
        parameters.newStatus = newStatus
        parameters.isModalButton = false
        setCandidateAction(recruiterId, jobId, "reject" , applicationId, {}, parameters);
    })

    candidates.onClickDownloadMassExcel(function(arr){

        var parameters = filters.getAppliedFilters();
        parameters.applicationId = arr.toString()
        var str = "?"
        for(var key in parameters) {
            str+= key + "=" + parameters[key] + "&";
        }
        candidates.setHref(str)
    })
    candidates.onClickDownloadMassResume(function(arr){
        var parameters = {}
        parameters.applicationId = arr.toString()
        downloadMassResume(recruiterId, jobId, parameters)
    })


    candidates.onClickMassActionButton(function(applicationIds, action, comment, newStatus){
        var data = {}
        data.applicationId = applicationIds
        data.comment = comment;
        var parameters= {};
        parameters.oldStatus = globalParameters.status
        parameters.newStatus = newStatus
        setBulkCandidateActions(recruiterId, jobId, action, data, parameters)
    })

    theJob.onClickSubmitUnpublishJob(function(reason){
        theJob.closeModal()
		theJob.showLoaderOverlay()
		return submitUnpublishJob(recruiterId, globalParameters.jobId, {reasonId: reason});
	});
	theJob.onClickSubmitRefreshJob(function(){
        theJob.closeModal()
		theJob.showLoaderOverlay()
		return submitRefreshJob(recruiterId, globalParameters.jobId);
	})
    theJob.onClickSubmitPremiumJob(function(){
        theJob.closeModal()
		theJob.showLoaderOverlay()
		return submitPremiumJob(recruiterId, globalParameters.jobId);
	})
    theJob.onChangeDefaultCalendar(function(calendarId) {
        var defaultCalendarId = theJob.getDefaultCalendar();
        setDefaultCalendar(recruiterId, jobId, calendarId, {defaultId: defaultCalendarId}, {})
        //postRequestDefaultCalendar
    })

     aCandidate.onClickAddTag(function(applicationId, parameters){
         var ob = {}
         if(parameters.tagId) {
             ob.tagId = parameters.tagId;
         }
         else {
             ob.name = parameters.tagName;
         }

         ob.type= "add";
         parameters.type = "add";
         setCandidateAction(recruiterId, jobId, "tag" , applicationId, ob, parameters);
     }, function(tagName){
         var parameters = {}
          parameters.pageNumber = 1;
          parameters.str = tagName
         fetchRecruiterTags(recruiterId, parameters)
     })

     aCandidate.onClickDeleteTag(function(applicationId, tagId){
         var parameters = {}
         var ob = {
             "tagId": tagId,
	         "type": "delete"
         }
         parameters.type = "delete"
         parameters.tagId = tagId
         setCandidateAction(recruiterId, jobId, "tag" , applicationId, ob, parameters);
     })

     aCandidate.onClickAddComment(function(applicationId, comment){
         var parameters = {}
         var ob = {
             "comment": comment
         }
         setCandidateAction(recruiterId, jobId, "comment" , applicationId, ob);
     })

     aCandidate.onClickAddCommentMob(function(applicationId, comment){
         var parameters = {}
         var ob = {
             "comment": comment
         }
         setCandidateAction(recruiterId, jobId, "comment" , applicationId, ob);
     })

     aCandidate.onClickAddTagMob(function(applicationId, parameters){
         var ob = {}
         if(parameters.tagId) {
             ob.tagId = parameters.tagId;
         }
         else {
             ob.name = parameters.tagName;
         }

         ob.type= "add";
         parameters.type = "add";
         setCandidateAction(recruiterId, jobId, "tag" , applicationId, ob, parameters);
     }, function(tagName){
         var parameters = {}
         parameters.pageNumber = 1;
         parameters.str = tagName
         fetchRecruiterTags(recruiterId, parameters)
     })

     aCandidate.onClickShortlistCandidate(function(applicationId, newStatus) {

         var parameters = {}
         parameters.isModal = true
         setCandidateAction(recruiterId, jobId, "shortlist" , applicationId, {}, parameters);
     })

     aCandidate.onClickRejectCandidate(function(applicationId, newStatus) {

         var parameters = {}
         parameters.isModal = true
         setCandidateAction(recruiterId, jobId, "reject" , applicationId, {}, parameters);
     })

     aCandidate.onClickSaveCandidate(function(applicationId, newStatus) {
         var parameters = {}
         parameters.isModal = true
         setCandidateAction(recruiterId, jobId, "save" , applicationId, {}, parameters);
     })

     $.when(fetchJob(jobId, recruiterId, {idType: 'publish'}), fetchCalendars(jobId, recruiterId)).then(function(a, b){
            debugger
         if(a[0] && b[0] && a[0]["status"] == "success" && b[0]["status"] =="success" && a[0]['data'].length >0 ) {
             var jobRow = a[0]['data'][0];
             console.log(b)
             var calendarRows = b[0]['data'];

             var data = {
                jobTitle: getTitleFormat(jobRow["title"],(/\(\d+-\d+ \w+\)$/)),
                jobLocation: jobRow["location"].toString(),
                jobExperience: jobRow["exp"]['min']+'-'+ jobRow['exp']['max'] +' yrs',
                jobPublishedId: jobRow['publishedId'],
                jobId: jobRow['id'],
                jobStatus: jobRow['status'],
                isPremium: jobRow['premium'],
                isEditable: jobRow['editable'],
                isRefreshable: jobRow["refreshable"],
                jobSocialShareUrl: jobRow["url"],
                calendars: calendarRows
             }
             return pubsub.publish("fetchedJobDetails:"+jobId, data);
         }
         return pubsub.publish("failedToFetchJobDetails:"+jobId, data);
     });


    function onJobsApplicationsFetchSuccess(topic, data) {
        //Call only on initial load
        if(globalParameters.initialLoad) {
            if(data["stats"]) {
                candidates.setJobStats(data["stats"]);
            }

            globalParameters.initialLoad = 0;
        }
        globalParameters.candidateListLength = data["data"].length;

        candidates.addToList(data["data"], globalParameters.status);
        filters.showResultsFound(globalParameters.candidateListLength)
        console.log(data)
        if(data["pageNumber"] == 1) {
            store.emptyStore(data["data"]);
        }
        store.saveToStore(data["data"]);
    }

	function onJobsApplicationsFetchFail(topic, data){
		console.log(topic)
		console.log(data)
	}

    function onSuccessfulFetchJobDetails(topic, data) {
        globalParameters.jobId = data["jobId"]
        var tabValue = [0,1,2,3,4,5]
        if(tabValue.indexOf(defaultTab) != -1) {
            globalParameters.status = defaultApplicationStatus[defaultTab];
            candidates.setDefaultTab(globalParameters.status)
        }
        var parameters = {}
        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;
        parameters.status = globalParameters.status;
        parameters.orderBy = globalParameters.orderBy;
        fetchJobApplications(jobId,parameters,recruiterId);
        theJob.setJobDetails(data);
    }

    function onFailedFetchJobDetails(topic, data) {
        console.log(topic)
		console.log(data)
    }

    function onSuccessfullCandidateAction(topic, res) {
        if(res.action == "tag") {
            if(res.parameters.type == "add") {
                var tag = {
                    "name": res.parameters.tagName,
                    "id": res.data.id
                }
                aCandidate.appendCandidateTag(tag)
                return toastNotify(1, "Tag Added Successfully")
            }
            var tagId = res.parameters.tagId
            aCandidate.removeTag(tagId)
            return toastNotify(1, "Tag Deleted Successfully")
        }
        if(res.action == "comment") {
            return toastNotify(1, "Comment Added Successfully")
        }
        if(res.action == "shortlist") {
            if(res.parameters.isModal) {
                return toastNotify(1, "Shortlisted Successfully")
            }

            fetchJobApplicationCount(recruiterId, jobId)
            var arr = [];
            arr.push(res.applicationId)
            if(res.parameters.oldStatus != "") {
                candidates.candidateActionTransition(arr)
                if(res.parameters.oldStatus == res.parameters.newStatus) {
                    return toastNotify(1, "Moved to Reviewed Tab")
                }
                return toastNotify(1, "Moved to Shortlisted Tab")
            }
            candidates.changeButtonText(arr, newStatus)
            return toastNotify(1, "Shortlisted Successfully")
        }
        if(res.action == "reject") {
            if(res.parameters.isModal) {
                return toastNotify(1, "Rejected Successfully")
            }

            fetchJobApplicationCount(recruiterId, jobId)
            if(res.parameters.oldStatus != "") {
                var arr = [];
                arr.push(res.applicationId)
                candidates.candidateActionTransition(arr)
                if(res.parameters.oldStatus == res.parameters.newStatus) {
                    return toastNotify(1, "Moved to Reviewed Tab")
                }
                return toastNotify(1, "Moved to Rejected Tab")
            }
            return toastNotify(1, "Rejected Successfully")
        }
        if(res.action == "save") {
            if(res.parameters.isModal) {
                return toastNotify(1, "Saved Successfully")
            }
            fetchJobApplicationCount(recruiterId, jobId)
            if(res.parameters.oldStatus != "") {
                var arr = [];
                arr.push(res.applicationId)
                candidates.candidateActionTransition(arr)
                if(res.parameters.oldStatus == res.parameters.newStatus) {
                    return toastNotify(1, "Moved to Reviewed Tab")
                }
                return toastNotify(1, "Moved to Saved Tab")
            }
            return toastNotify(1, "Saved Successfully")
        }
    }

    function onFailCandidateAction(topic,res) {
        errorHandler(res);
    }

    function onSuccessfullFetchedTag(topic, res) {
        aCandidate.showDropdownTags(res["data"]);
    }

    function onFailFetchedTag(topic, res) {
        errorHandler(res);
    }

    function onSuccessfullSetDefaultCalendar(topic, res) {
        toastNotify(1, "Default Calendar Set.")
    }

    function onFailSetDefaultCalendar(topic, res) {
        errorHandler(res);
    }

    function onSuccessfullCandidateBulkAction(topic,res) {
        if(res.action == "comment") {
            candidates.closeModal()
            return toastNotify(1, "Comment Added Successfully")
        }

        if(res.action == "shortlist") {
            candidates.closeModal()
            if(res.parameters.oldStatus != "") {

                candidates.candidateActionTransition(res.applicationId)
                return toastNotify(1, res.applicationId.length +" candidates have been shortlisted and moved to the shortlisted tab.")
            }
            fetchJobApplicationCount(recruiterId, jobId)
            return toastNotify(1, res.applicationId.length +" candidates have been shortlisted")

        }

        if(res.action == "reject") {
            candidates.closeModal()
            if(res.parameters.oldStatus != "") {

                candidates.candidateActionTransition(res.applicationId)
                return toastNotify(1, res.applicationId.length +" candidates have been rejected and moved to the rejected tab.")
            }
            fetchJobApplicationCount(recruiterId, jobId)
            return toastNotify(1, res.applicationId.length +" candidates have been rejected")
        }

        if(res.action == "save") {
            candidates.closeModal()
            if(res.parameters.oldStatus != "") {
                candidates.candidateActionTransition(res.applicationId)
                return toastNotify(1, res.applicationId.length +" candidates have been saved and moved to the saved tab.")
            }
            fetchJobApplicationCount(recruiterId, jobId)
            return toastNotify(1, res.applicationId.length +" candidates have been saved")
        }
    }

    function onFailCandidateBulkAction(topic, res) {
        errorHandler(res)
    }

    function onDownloadSuccess(topic, res) {
        return toastNotify(1, "An Email has been sent with the download link!")
    }

    function onDownloadFail(topic, res) {
        errorHandler(res)
    }

    function onSuccessfulUnpublishedJob(topic, data) {
        theJob.hideLoaderOverlay()
		toastNotify(1, "Job Unpublish Successfully")
		setTimeout(function(){
			 location.reload()
		 }, 2000);
	}

	function onFailedUnpublishedJob(topic,data) {
        theJob.openModal("unpublish")
		errorHandler(data)
	}
	function onSuccessfulRefreshJob(topic, data){
        theJob.hideLoaderOverlay()
        toastNotify(1, "Job Refreshed Successfully")
        setTimeout(function(){
             location.reload()
         }, 2000);
	}
	function onFailedRefreshJob(topic, data){
        theJob.openModal("refresh")
		errorHandler(data)
	}
	function onSuccessfulPremiumJob(topic, data){
        theJob.hideLoaderOverlay()
        toastNotify(1, "Job Made Premium Successfully")
        setTimeout(function(){
             location.reload()
         }, 2000);
	}
	function onFailedPremiumJob(topic, data){
        theJob.openModal("premium")
		errorHandler(data)
	}

    function onSuccessfulCount(topic, data) {
        candidates.setJobStats(data);
    }

    function onFailedCount() {

    }

    var fetchJobDetailsSubscription = pubsub.subscribe("fetchedJobDetails:"+jobId, onSuccessfulFetchJobDetails)
	var fetchJobDetailsFailSubscription = pubsub.subscribe("failedToFetchJobDetails:"+jobId, onFailedFetchJobDetails);
    var fetchJobApplicationsSuccessSubscription = pubsub.subscribe("fetchedJobApplication:"+jobId, onJobsApplicationsFetchSuccess)
    var fetchJobApplicationsFailSubscription = pubsub.subscribe("failedTofetchJobApplication:"+jobId, onJobsApplicationsFetchFail)
    var setCandidateActionSuccessSubscription = pubsub.subscribe("setCandidateActionSuccess", onSuccessfullCandidateAction)
    var setCandidateActionFailSubscription = pubsub.subscribe("setCandidateActionFail", onFailCandidateAction)
    var fetchedTagsSuccessSubscription = pubsub.subscribe("fetchedTags", onSuccessfullFetchedTag)
    var fetchTagsFailSubscription = pubsub.subscribe("fetchTagsFail", onFailFetchedTag)
    var setDefaultCalendarSuccessSubscription = pubsub.subscribe("setDefaultCalendarSuccess", onSuccessfullSetDefaultCalendar)
    var setDefaultCalendarFailSubscription = pubsub.subscribe("setDefaultCalendarFail", onFailSetDefaultCalendar)
    var setCandidateBulkActionSuccessSubscription = pubsub.subscribe("setCandidateBulkActionSuccess", onSuccessfullCandidateBulkAction)
    var setCandidateBulkActionFailSubscription = pubsub.subscribe("setCandidateBulkActionFail", onFailCandidateBulkAction)
    var downloadSuccessSubscription = pubsub.subscribe("downloadedSuccess", onDownloadSuccess)
    var downloadFailSubscription = pubsub.subscribe("downloadedFail", onDownloadFail)
    var unPublishJobSuccessSubscription = pubsub.subscribe("jobUnpublishSuccess", onSuccessfulUnpublishedJob);
	var unPublishJobFailSubscription = pubsub.subscribe("jobUnpublishFail", onFailedUnpublishedJob);

	var refreshJobSuccessSubscription = pubsub.subscribe("jobRefreshSuccess", onSuccessfulRefreshJob)
	var refreshJobFailSubscription = pubsub.subscribe("jobRefreshFail", onFailedRefreshJob)

	var premiumJobSuccessSubscription = pubsub.subscribe("jobPremiumSuccess", onSuccessfulPremiumJob)
	var premiumJobFailSubscription = pubsub.subscribe("jobPremiumFail", onFailedPremiumJob);

    var fetchedApplicationCountSuccessSubscription = pubsub.subscribe("fetchedApplicationCountSuccess", onSuccessfulCount)
	var fetchedApplicationCountFailSubscription = pubsub.subscribe("fetchedApplicationCountFail", onFailedCount);

    var ticker;
    $(window).scroll(function() {
     clearTimeout(ticker);
     ticker = setTimeout(checkScrollEnd,100);
    });

    function checkScrollEnd() {
    	if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
    		globalParameters.pageNumber = globalParameters.pageNumber + 1;
    		if(globalParameters.pageNumber != 1 && globalParameters.candidateListLength == globalParameters.pageContent) {
                var parameters = filters.getAppliedFilters();
                parameters.pageNumber = globalParameters.pageNumber;
                parameters.pageContent = globalParameters.pageContent;
                parameters.status = globalParameters.status;
    			fetchJobApplications(jobId,parameters,recruiterId)
    		}
    	}
    }
})

function getTitleFormat(title, regex) {
    return title.replace(regex, '');
}

function errorHandler(data) {
    if(!data) {
        return toastNotify(3, "Something went wrong");
    }
    return toastNotify(3, data.message);
}
