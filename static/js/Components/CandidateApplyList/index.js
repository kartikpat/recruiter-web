var globalParameters = {
    pageContent: 10,
    pageNumber: 1,
    status: "",
    orderBy: 1,
    initialLoad: 1,
    candidateListLength: null
}
jQuery(document).ready( function() {


    // fetching url parameters
    var urlParams = fetchURL();
    var jobId = urlParams.pathname.split("/")[2];

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

    //setting config variables
    theJob.setConfig("availableCredits", profile["availableCredits"]);

    filters.addFilterData('industry', industryTagsData);
    filters.addFilterData('functionalArea',functionalAreaTagsData)
    filters.addFilterData('institute', instituteTagsData)
    filters.addFilterData('currentLocation', currentLocationTagsData)
    filters.addFilterData('language', languageTagsData)
    filters.addFilterData('preferredLocation', prefeLocationTagsData);
    filters.onClickApplyFilterButton(function(name){
        filters.setAppliedFilters(name);
        var parameters = filters.getAppliedFilters();
        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;
        parameters.status = globalParameters.status;
        candidates.emptyCandidateList()
        return fetchJobApplications(jobId, parameters, recruiterId)
    });
    filters.onClickRemoveFilter(function(value,category,type){
        filters.removeFilter(value,category,type);
        var parameters = filters.getAppliedFilters();
        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;
        parameters.status = globalParameters.status;
        candidates.emptyCandidateList()
        return fetchJobApplications(jobId, parameters, recruiterId);
    })
    filters.onClickSearchButton(function(){
        var parameters = filters.getAppliedFilters();
        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;
        parameters.status = globalParameters.status;
        candidates.emptyCandidateList()
        fetchJobApplications(jobId, parameters, recruiterId);
    })
    filters.onSelectSortByOption(function(){
        var parameters = filters.getAppliedFilters();
        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;
        parameters.status = globalParameters.status;
        candidates.emptyCandidateList()
        return fetchJobApplications(jobId, parameters, recruiterId);
    })
    filters.onClickRemoveAllFilters(function(){
        var parameters = filters.getAppliedFilters();
        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;
        parameters.status = globalParameters.status;
        candidates.emptyCandidateList()
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
    candidates.createJobApplicationStatsTabs(function(event, ui) {
        var status = candidates.activateStatsTab(event, ui)
        var parameters = filters.getAppliedFilters();
        globalParameters.status = status;
        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;
        parameters.status = globalParameters.status;
        candidates.emptyCandidateList()
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
        if(newStatus == globalParameters.status) {
            return toastNotify("3", "Already Saved for later")
        }
         var parameters = {};
         parameters.oldStatus = globalParameters.status
         parameters.newStatus = newStatus
         parameters.isModalButton = false
         setCandidateAction(recruiterId, jobId, "save" , applicationId, {}, parameters);
     })
    candidates.onClickShortlistCandidate(function(applicationId, newStatus){
        if(newStatus == globalParameters.status) {
            return toastNotify("3", "Already Shortlisted")
        }
        var parameters = {};
        parameters.oldStatus = globalParameters.status
        parameters.newStatus = newStatus
        parameters.isModalButton = false
        setCandidateAction(recruiterId, jobId, "shortlist" , applicationId, {}, parameters);
    })
    candidates.onClickRejectCandidate(function(applicationId, newStatus){
        if(newStatus == globalParameters.status) {
            return toastNotify("3", "Already Rejected")
        }
        var parameters= {};
        parameters.oldStatus = globalParameters.status
        parameters.newStatus = newStatus
        parameters.isModalButton = false
        setCandidateAction(recruiterId, jobId, "reject" , applicationId, {}, parameters);
    })
    candidates.onClickMassTag(function(){

    })
    candidates.onClickMassComment(function(){

    })

    theJob.onClickJobCancel(function(jobId){
        alert(jobId)
        trackEventCancelButtonClick();
    })
    theJob.onClickJobRefresh(function(jobId) {
        alert(jobId)
    })
    theJob.onClickJobMakePremium(function(jobId){
        alert(jobId)
    })
    theJob.onChangeDefaultCalendar(function(calendarId) {
        alert(calendarId)
        //postRequestDefaultCalendar
    })

     aCandidate.onClickAddTag(function(applicationId, tagName){
         var parameters = {}
         var ob = {
             "name": tagName,
	         "type": "add"
         }
         parameters.type = "add"
         parameters.tagName = tagName
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

     aCandidate.onClickAddTagMob(function(applicationId, tagName){
         var parameters = {}
         var ob = {
             "name": tagName,
	         "type": "add"
         }
         parameters.type = "add"
         parameters.tagName = tagName
         setCandidateAction(recruiterId, jobId, "tag" , applicationId, ob, parameters);
     }, function(tagName){
         var parameters = {}
         parameters.pageNumber = 1;
         parameters.str = tagName
         fetchRecruiterTags(recruiterId, parameters)
     })

     aCandidate.onClickShortlistCandidate(function(applicationId, newStatus) {
         if(newStatus == globalParameters.status) {
             return toastNotify("3", "Already Shortlisted")
         }
         var parameters = {}
         parameters.isModal = true
         setCandidateAction(recruiterId, jobId, "shortlist" , applicationId, {}, parameters);
     })

     aCandidate.onClickRejectCandidate(function(applicationId, newStatus) {
         if(newStatus == globalParameters.status) {
             return toastNotify("3", "Already Rejected")
         }
         var parameters = {}
         parameters.isModal = true
         setCandidateAction(recruiterId, jobId, "reject" , applicationId, {}, parameters);
     })

     aCandidate.onClickSaveCandidate(function(applicationId, newStatus) {
         if(newStatus == globalParameters.status) {
             return toastNotify("3", "Already Saved for later")
         }
         var parameters = {}
         parameters.isModal = true
         setCandidateAction(recruiterId, jobId, "save" , applicationId, {}, parameters);
     })

     $.when(fetchJob(jobId, recruiterId, {idType: 'publish'}), fetchCalendars(jobId, recruiterId)).then(function(a, b){
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
                calendars: calendarRows
             }
             return pubsub.publish("fetchedJobDetails:"+jobId, data);
         }
         return pubsub.publish("failedToFetchJobDetails:"+jobId, data);
     });


    function onJobsApplicationsFetchSuccess(topic, data) {
        //Call only on initial load
        if(globalParameters.initialLoad) {
            candidates.setJobStats(data["stats"]);
            globalParameters.initialLoad = 0;
        }

        globalParameters.candidateListLength = data["data"].length;
        candidates.addToList(data["data"], globalParameters["status"]);
        filters.showResultsFound(globalParameters.candidateListLength)
        store.emptyStore(data["data"]);
        store.saveToStore(data["data"]);
    }

	function onJobsApplicationsFetchFail(topic, data){
		console.log(topic)
		console.log(data)
	}

    function onSuccessfulFetchJobDetails(topic, data) {
        fetchJobApplications(jobId,globalParameters,recruiterId);
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
            candidates.updateJobStats(res.parameters.oldStatus, res.parameters.newStatus)
            if(res.parameters.oldStatus != "") {
                candidates.candidateActionTransition(res.applicationId)
                return toastNotify(1, "Moved to Shortlisted Tab")
            }

        }
        if(res.action == "reject") {
            if(res.parameters.isModal) {
                return toastNotify(1, "Rejected Successfully")
            }
            candidates.updateJobStats(res.parameters.oldStatus, res.parameters.newStatus)
            if(res.parameters.oldStatus != "") {
                candidates.candidateActionTransition(res.applicationId)
                return toastNotify(1, "Moved to Rejected Tab")
            }
        }
        if(res.action == "save") {
            if(res.parameters.isModal) {
                return toastNotify(1, "Saved Successfully")
            }
            candidates.updateJobStats(res.parameters.oldStatus, res.parameters.newStatus)
            if(res.parameters.oldStatus != "") {
                candidates.candidateActionTransition(res.applicationId)
                return toastNotify(1, "Moved to Saved Tab")
            }
        }
        // if(globalParameters.action == "tag") {
        //     alert("success")
        // }
        // if(globalParameters.action == "tag") {
        //     alert("success")
        // }
        // if(globalParameters.action == "tag") {
        //     alert("success")
        // }
    }

    function onFailCandidateAction(topic,res) {
        if(!res) {
            return toastNotify(3, "You are not connected to the network");
        }
        return toastNotify(3, res.message);
    }

    function onSuccessfullFetchedTag(topic, res) {
        aCandidate.showDropdownTags(res["data"]);
    }

    function onFailFetchedTag(topic, res) {
        if(!res) {
            return toastNotify(3, "You are not connected to the network");
        }
        return toastNotify(3, res.message);
    }


    var fetchJobDetailsSubscription = pubsub.subscribe("fetchedJobDetails:"+jobId, onSuccessfulFetchJobDetails)
	var fetchJobDetailsFailSubscription = pubsub.subscribe("failedToFetchJobDetails:"+jobId, onFailedFetchJobDetails);
    var fetchJobApplicationsSuccessSubscription = pubsub.subscribe("fetchedJobApplication:"+jobId, onJobsApplicationsFetchSuccess)
    var fetchJobApplicationsFailSubscription = pubsub.subscribe("failedTofetchJobApplication:"+jobId, onJobsApplicationsFetchFail)
    var setCandidateActionSuccessSubscription = pubsub.subscribe("setCandidateActionSuccess", onSuccessfullCandidateAction)
    var setCandidateActionFailSubscription = pubsub.subscribe("setCandidateActionFail", onFailCandidateAction)
    var fetchedTagsSuccessSubscription = pubsub.subscribe("fetchedTags", onSuccessfullFetchedTag)
    var fetchTagsFailSubscription = pubsub.subscribe("fetchTagsFail", onFailFetchedTag)

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
