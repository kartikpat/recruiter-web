var globalParameters = {
    pageContent: 10,
    pageNumber: 1,
    status: "0",
    orderBy: 1,
    initialLoad: 1,
    candidateListLength: null
}
var screenName = "candidate-apply-list";

jQuery(document).ready( function() {

    // creating the instance of models
	var candidates = candidateList();
    var aCandidate = Candidate();
    var theJob = Job();
    var store = Store();
    var filters = Filters();

    //initializing the models
    candidates.setConfig("jobId", jobId)
    filters.init();
    candidates.init(profile);
    theJob.init();
    aCandidate.init();

    var obj = getQueryParameters()
    if(!isEmpty(obj)) {
        var filterFlag = 0;
        for(var key in obj) {
            if(key == "status") {
                globalParameters.status = obj[key]
            }
            else if (key == "orderBy") {
                globalParameters.orderBy = obj[key]
                filters.changeSelectValue(obj[key])
            }
            // else if (key == "pageNumber") {
            //     globalParameters.pageNumber = obj[key]
            // }
            // else if (key == "pageContent") {
            //     globalParameters.pageContent = obj[key]
            // }
            if(key && [ 'status', 'pageNumber', 'pageContent'].indexOf(key) != -1) {
                continue
            }
            filters.callClickOnFilters(filtersMapping[key], obj[key], minMaxMapping[key])
            if(!(key == "orderBy" || key == "pageNumber" || key == "pageContent" || key == "status" || key == "searchString")) {
              filterFlag+= 1;
            }
        }
        console.log(filters.getFiltersObj())
        if(filterFlag > 0) {
            filters.addFiltersToContainer()
            filters.showAppliedFilters()
        }
    }


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
    $(".downloadExcelMass").attr('href', baseUrl+"/recruiter/"+recruiterId+"/jobs/"+jobId+"/applications/download/excel");

    // mountint routing
    page.base('/job/'+jobId+'/applications');

    page('/:applicationId', function(context, next){
        // var parameters = filters.getAppliedFilters()
        // parameters.status = globalParameters.status;
        // setQueryParameters(parameters)
        var applicationId = context.params.applicationId;
        var hash = context.hash || "";
        var candidateDetails = store.getCandidateFromStore(applicationId);
        aCandidate.showCandidateDetails(candidateDetails,hash, candidateDetails.status);
        if(parseInt(candidateDetails.status) == 0)
            setCandidateAction(recruiterId, jobId, "view" , applicationId, {});

    });
    page('/', function(context, next){
        aCandidate.closeModal();
    })

    page();

    filters.addFilterData('industry', industryTagsData);
    filters.addFilterData('functionalArea',functionalAreaTagsData)
    filters.addFilterData('institute', instituteTagsData)
    filters.addFilterData('currentLocation', currentLocationTagsData)
    filters.addFilterData('language', languageTagsData)
    filters.addFilterData('preferredLocation', prefeLocationTagsData);

    filters.onClickApplyFilterButton(function(name){
        if(!filters.checkForError(name)) {
            return
        }
        filters.setAppliedFilters(name);
        filters.addFiltersToContainer()
        filters.closeFilterModal()
        candidates.showShells(globalParameters.status)
        candidates.removeCandidate(globalParameters.status)
        candidates.hideEmptyScreen()

        var parameters = filters.getAppliedFilters();
        parameters.status = globalParameters.status;
        setQueryParameters(parameters)

        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;

        var filterFlag = 0;
        for(var key in parameters) {
          if(!(key == "orderBy" || key == "pageNumber" || key == "pageContent" || key == "status")) {
            filterFlag+= 1;
          }
        }

        if(filterFlag > 0) {
            filters.showAppliedFilters();
        }

        return fetchJobApplications(jobId, parameters, recruiterId)
    });
    filters.onClickRemoveFilter(function(value,category,type){
        candidates.showShells(globalParameters.status)
        candidates.removeCandidate(globalParameters.status)
        candidates.hideEmptyScreen()
        filters.removeFilter(value,category,type);
        var parameters = filters.getAppliedFilters();
        parameters.status = globalParameters.status;
        setQueryParameters(parameters);

        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;

        return fetchJobApplications(jobId, parameters, recruiterId);
    })
    filters.onClickSearchButton(function(){
        candidates.showShells(globalParameters.status)
        candidates.removeCandidate(globalParameters.status)
        candidates.hideEmptyScreen()
        var parameters = filters.getAppliedFilters();
        parameters.status = globalParameters.status;
        setQueryParameters(parameters);

        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;

        fetchJobApplications(jobId, parameters, recruiterId);
    })
    filters.onSelectSortByOption(function(){
        candidates.showShells(globalParameters.status)
        candidates.removeCandidate(globalParameters.status)
        candidates.hideEmptyScreen()
        var parameters = filters.getAppliedFilters();
        parameters.status = globalParameters.status;
        setQueryParameters(parameters);

        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;

        return fetchJobApplications(jobId, parameters, recruiterId);
    })
    filters.onClickRemoveAllFilters(function(){
        candidates.showShells(globalParameters.status)
        candidates.removeCandidate(globalParameters.status)
        candidates.hideEmptyScreen()
        var parameters = filters.getAppliedFilters();
        console.log(parameters)
        parameters.status = globalParameters.status;
        setQueryParameters(parameters)

        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;

        return fetchJobApplications(jobId, parameters, recruiterId);
    })

    // candidates.onClickCandidate(function(candidateId, status, applicationId){
    //     var candidateDetails = store.getCandidateFromStore(candidateId);
    //     aCandidate.showCandidateDetails(candidateDetails,"", status);
    //     if(parseInt(status) == 0)
    //         setCandidateAction(recruiterId, jobId, "view" , applicationId, {});

    // });
    candidates.onClickAddTag(function(applicationId) {
        var candidateDetails = store.getCandidateFromStore(applicationId);
        page('/'+applicationId+'#tag')
    })
    candidates.onClickAddComment(function(applicationId) {
        var candidateDetails = store.getCandidateFromStore(applicationId);
        page('/'+applicationId+'#comment')
    })
    candidates.onClickViewComment(function(applicationId) {
        var candidateDetails = store.getCandidateFromStore(applicationId);
        page('/'+applicationId+'#comment')
    })
    candidates.onClickViewTag(function(applicationId) {
         var candidateDetails = store.getCandidateFromStore(applicationId);
         page('/'+applicationId+'#tag')
    })
    candidates.onClickSendMessage(function(candidateId,applicationId){
        var candidate = store.getCandidateFromStore(applicationId);
        var array = [];
        array.push(candidate);

        cloneStickyChat(array, recruiterId, jobId, applicationId)
    })

    aCandidate.onClickSeeMoreRec(function() {
        // fetchRecommendations(recruiterId)
    })

    aCandidate.onClickChatCandidateModal(function(candidateId,applicationId){
        var candidate = store.getCandidateFromStore(applicationId);
        var array = [];
        array.push(candidate);
        cloneStickyChat(array, recruiterId, jobId, applicationId)
    })
    aCandidate.onClickSendInterviewInviteF2F(function(applicationId, inviteId){
        var defaultCalendarId = theJob.getDefaultCalendar();
        if(!defaultCalendarId)
            return theJob.showCalendarMissingError();
        var obj = {
            "type": inviteId,
            "calendarId": theJob.getSelectedCalendarId()
        }
        sendInterViewInvite(recruiterId, jobId, applicationId , obj)
    })
    aCandidate.onClickSendInterviewInviteTelephonic(function(applicationId, inviteId){
        var defaultCalendarId = theJob.getDefaultCalendar();
        if(!defaultCalendarId)
            return theJob.showCalendarMissingError();
        var obj = {
            "type": inviteId,
            "calendarId": theJob.getSelectedCalendarId()
        }
        sendInterViewInvite(recruiterId, jobId, applicationId , obj)
    })
    candidates.onClickSendInterviewInviteF2F(function(applicationId, inviteId){
        var defaultCalendarId = theJob.getDefaultCalendar();
        if(!defaultCalendarId)
            return theJob.showCalendarMissingError();
        var obj = {
            "type": inviteId,
            "calendarId": theJob.getSelectedCalendarId()
        }
        sendInterViewInvite(recruiterId, jobId, applicationId , obj)
    })
    candidates.onClickSendInterviewInviteTelephonic(function(applicationId, inviteId){
        var defaultCalendarId = theJob.getDefaultCalendar();
        if(!defaultCalendarId)
            return theJob.showCalendarMissingError();
        var obj = {
            "type": inviteId,
            "calendarId": theJob.getSelectedCalendarId()
        }
        sendInterViewInvite(recruiterId, jobId, applicationId , obj)
    })
    candidates.onChangeCandidateCheckbox(function(candidateId){
        // alert(candidateId)
    })
    candidates.initializeJqueryTabs(defaultTabObj[globalParameters.status], function(event, ui) {

        tickerLock = false;
        var status = candidates.activateStatsTab(event, ui)
        candidates.showShells(status);
        candidates.removeCandidate(status)

        var parameters = filters.getAppliedFilters();
        globalParameters.status = status;
        parameters.status = globalParameters.status;
        setQueryParameters(parameters);

        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;

        fetchJobApplications(jobId, parameters,recruiterId);
    })

    candidates.onClickDownloadResume(function(applicationId, status){
        if(parseInt(status) == 0)
            setCandidateAction(recruiterId, jobId, "download" , applicationId, {});
    });
    candidates.onClickSaveCandidate(function(applicationId, newStatus, dataAction){
        var action;
        if(parseInt(dataAction) == parseInt(newStatus)) {
            action = "unread"
        }
        else {
            action = "save"
        }
        var parameters = {};
        parameters.oldStatus = globalParameters.status
        parameters.newStatus = newStatus
        parameters.dataAction = dataAction;
        parameters.isModalButton = false
        setCandidateAction(recruiterId, jobId, action , applicationId, {}, parameters);
     })
    candidates.onClickShortlistCandidate(function(applicationId, newStatus, dataAction){
        var action;
        if(parseInt(dataAction) == parseInt(newStatus)) {
            action = "unread"
        }
        else {
            action = "shortlist"
        }
        var parameters = {};
        parameters.oldStatus = globalParameters.status
        parameters.newStatus = newStatus;
        parameters.dataAction = dataAction;
        parameters.isModalButton = false
        setCandidateAction(recruiterId, jobId, action , applicationId, {}, parameters);
    })
    function onSuccessfullCandidateAction(topic, res) {
        var arr = [];
        arr.push(res.applicationId)

        if(res.action == "view") {
            var newStatus = 4
            return candidates.changeStatus(arr, newStatus)
        }

        if(res.action == "download") {
            var newStatus = 5
            return candidates.changeStatus(arr, newStatus)
        }
        $.when(null, fetchJobApplicationCount(recruiterId, jobId)).then(function(a,b){
            if( b[0] && b[0]["status"] == "success") {
                var applicantsCount = b[0]['data'];
                var data = {
                    applicantsCount: applicantsCount
                }
                return pubsub.publish("fetchedCount", data);
            }
            return pubsub.publish("failedToFetchCount", a[0]["status"]);
        })
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

        if(res.parameters.oldStatus != "") {
            candidates.candidateActionTransition(arr)
            checkApplicationLength()
        }

        if(res.action == "unread") {
            $('.spinner').addClass('hidden');
            $('.shortlist').removeClass('hidden');
            $('.reject').removeClass('hidden');
            var newStatus = 0
            if(res.parameters.isModalButton) {
                candidates.changeButtonText(arr, newStatus, res.parameters.dataAction)
                aCandidate.changeButtonText(arr, newStatus, res.parameters.dataAction)
                return toastNotify(1, "Moved to Unread Tab")
            }

            if(res.parameters.oldStatus != "") {
                return toastNotify(1, "Moved to Unread Tab")
            }

            aCandidate.changeButtonText(arr, newStatus, res.parameters.dataAction)
            candidates.changeButtonText(arr, newStatus, res.parameters.dataAction)
            return toastNotify(1, "Moved to Unread Tab")
        }
        if(res.action == "shortlist") {
            $('.spinner').addClass('hidden');
            $('.shortlist').removeClass('hidden');
            var newStatus = 1
            if(res.parameters.isModalButton) {
                candidates.changeButtonText(arr, newStatus, res.parameters.dataAction)
                aCandidate.changeButtonText(arr, newStatus, res.parameters.dataAction)
                return toastNotify(1, "Moved to Shortlisted Tab")
            }

            if(res.parameters.oldStatus != "") {
                return toastNotify(1, "Moved to Shortlisted Tab")
            }
            aCandidate.changeButtonText(arr, newStatus, res.parameters.dataAction)
            candidates.changeButtonText(arr,newStatus, res.parameters.dataAction)
            return toastNotify(1, "Moved to Shortlisted Tab")
        }
        if(res.action == "reject") {
            $('.spinner').addClass('hidden');
            $('.reject').removeClass('hidden');
            var newStatus = 2
            if(res.parameters.isModalButton) {
                candidates.changeButtonText(arr, newStatus, res.parameters.dataAction)
                aCandidate.changeButtonText(arr, newStatus, res.parameters.dataAction)
                return toastNotify(1, "Moved to Rejected Tab")
            }

            if(res.parameters.oldStatus != "") {
                return toastNotify(1, "Moved to Rejected Tab")
            }
            aCandidate.changeButtonText(arr, newStatus, res.parameters.dataAction)
            candidates.changeButtonText(arr,newStatus, res.parameters.dataAction)
            return toastNotify(1, "Moved to Rejected Tab")
        }
        if(res.action == "save") {
            var newStatus = 3
            if(res.parameters.isModalButton) {
                candidates.changeButtonText(arr, newStatus, res.parameters.dataAction)
                aCandidate.changeButtonText(arr, newStatus, res.parameters.dataAction)
                return toastNotify(1, "Moved to Saved Tab")
            }

            if(res.parameters.oldStatus != "") {
                return toastNotify(1, "Moved to Saved Tab")
            }
            aCandidate.changeButtonText(arr, newStatus, res.parameters.dataAction)
            candidates.changeButtonText(arr,newStatus, res.parameters.dataAction)
            return toastNotify(1, "Moved to Saved Tab")
        }

    }

    function checkApplicationLength() {

        var length = candidates.getApplicationsLength()
        if(length <= 2) {
            var parameters = filters.getAppliedFilters();
            parameters.status = globalParameters.status;
            setQueryParameters(parameters);
            globalParameters.pageNumber = globalParameters.pageNumber + 1;
            parameters.pageNumber = globalParameters.pageNumber;
            parameters.pageContent = globalParameters.pageContent;
            showLoader()
            fetchJobApplications(jobId, parameters,recruiterId);
        }
    }

    candidates.onClickRejectCandidate(function(applicationId, newStatus, dataAction){
        var action;
        if(parseInt(dataAction) == parseInt(newStatus)) {
            action = "unread"
        }
        else {
            action = "reject"
        }
        var parameters = {};
        parameters.oldStatus = globalParameters.status
        parameters.newStatus = newStatus
        parameters.dataAction = dataAction;
        parameters.isModalButton = false
        setCandidateAction(recruiterId, jobId, action , applicationId, {}, parameters);
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

    candidates.onClickMassActionButton(function(applicationIds, action, comment, newStatus, typeRequest, from, to){
        var data = {}
        var parameters = {};

        if(comment != '') {
            data.comment = comment;
        }
        if(typeRequest == "bulkRequestDropdown") {
            data = filters.getAppliedFilters();
            data.from = parseInt(from);
            data.to = parseInt(to);
            data.status = globalParameters.status;
            parameters.status = globalParameters.status;
            parameters.length = (to - from) + 1;
            return
        }
        else {
            data.applicationId = applicationIds
            parameters.oldStatus = globalParameters.status
            parameters.newStatus = newStatus
            parameters.length = applicationIds.length
        }
        setBulkCandidateActions(recruiterId, jobId, action, data, parameters)
    })

    theJob.onClickSubmitUnpublishJob(function(reason){
        theJob.closeModal()
		theJob.showLoaderOverlay()
		return submitUnpublishJob(recruiterId, globalParameters.jobId, {reasonId: reason});
	});
	theJob.onClickSubmitRefreshJob(function(jobId){
        theJob.closeModal()
		theJob.showLoaderOverlay()
		return submitRefreshJob(recruiterId,jobId);
	})
    theJob.onClickSubmitPremiumJob(function(){
        theJob.closeModal()
		theJob.showLoaderOverlay()
		return submitPremiumJob(recruiterId, globalParameters.jobId);
	})
    theJob.onChangeDefaultCalendar(function(calendarId) {
        var defaultCalendarId = theJob.getDefaultCalendar();
        var obj = {}
        if(defaultCalendarId) {
            obj = {
                defaultId: defaultCalendarId
            }
        }
        setDefaultCalendar(recruiterId, jobId, calendarId, obj, {})
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

     aCandidate.onClickShortlistCandidate(function(applicationId, newStatus, dataAction) {
         var action;
         if(parseInt(dataAction) == parseInt(newStatus)) {
             action = "unread"
         }
         else {
             action = "shortlist"
         }
         var parameters = {};
         parameters.oldStatus = globalParameters.status;
         parameters.newStatus = newStatus;
         parameters.dataAction = dataAction;
         parameters.isModalButton = true
         setCandidateAction(recruiterId, jobId, action , applicationId, {}, parameters);
     })

     aCandidate.onClickRejectCandidate(function(applicationId, newStatus, dataAction) {
         var action;
         if(parseInt(dataAction) == parseInt(newStatus)) {
             action = "unread"
         }
         else {
             action = "reject"
         }
         var parameters = {};
         parameters.newStatus = newStatus;
         parameters.dataAction = dataAction;
         parameters.isModalButton = true
         setCandidateAction(recruiterId, jobId, action , applicationId, {}, parameters);
     })

     aCandidate.onClickSaveCandidate(function(applicationId, newStatus, dataAction) {
         var action;
         if(parseInt(dataAction) == parseInt(newStatus)) {
             action = "unread"
         }
         else {
             action = "save"
         }
         var parameters = {};
         parameters.newStatus = newStatus;
         parameters.dataAction = dataAction;
         parameters.isModalButton = true
         setCandidateAction(recruiterId, jobId, action , applicationId, {}, parameters);
     })

     aCandidate.onClickCloseModal(function(){
        var parameters = filters.getAppliedFilters();
        parameters.status = globalParameters.status;
        setQueryParameters(parameters);
     })

     function getLocation(arr) {
         var array = []
         arr.forEach(function(value, index){
     		for(var locCategory in cityList) {
     			if(cityList[locCategory][value]) {
                    var locName = cityList[locCategory][value];
     				array.push(locName)
     			}
     		}
     	})
        return array;
     }

     $.when(fetchJob(jobId, recruiterId, {idType: 'publish'}), fetchjobCalendars(jobId, recruiterId)).then(function(a, b){

         if(a[0] && b[0] && a[0]["status"] == "success" && b[0]["status"] =="success" && a[0]['data'].length >0 ) {
             var jobRow = a[0]['data'][0];

             var calendarRows = b[0]['data'];

             var data = {
                jobTitle: getTitleFormat(jobRow["title"],(/\(\d+-\d+ \w+\)$/)),
                jobLocation: getLocation(jobRow["location"]),
                jobExperience: jobRow["exp"]['min']+ ' - ' + jobRow['exp']['max'] +' yrs',
                jobPublishedId: jobRow['publishedId'],
                jobId: jobRow['id'],
                jobStatus: jobRow['status'],
                isPremium: jobRow['premium'],
                isEditable: jobRow['editable'],
                isRefreshable: jobRow["refreshable"],
                jobSocialShareUrl: jobRow["url"],
                cnfi: jobRow["cnfi"],
                calendars: calendarRows
             }
             return pubsub.publish("fetchedJobDetails:"+jobId, data);
         }
         return pubsub.publish("failedToFetchJobDetails:"+jobId, data);
     });


    function onJobsApplicationsFetchSuccess(topic, data) {
        tickerLock = false;
        hideLoader()
        globalParameters.candidateListLength = data["data"].length;

        var filterFlag = 0;
        var parameters = filters.getAppliedFilters();
        parameters.status = globalParameters.status;
        for(var key in parameters) {
            if(!(key == "orderBy" || key == "pageNumber" || key == "pageContent" || key == "status" || key == "searchString")) {
                filterFlag+= 1;
            }
        }


            $.when(fetchFiltersCount(recruiterId, jobId, parameters), fetchJobApplicationCount(recruiterId, jobId)).then(function(a,b){
                if(a[0] && b[0] && a[0]["status"] == "success" && b[0]["status"] == "success") {
                    var filtersCount = a[0]['data'];
                    var applicantsCount = b[0]['data'];
                    var data = {
                        filtersCount: filtersCount,
                        applicantsCount: applicantsCount,
                        filterFlag: filterFlag
                    }
                    return pubsub.publish("fetchedCount", data);
                }
                return pubsub.publish("failedToFetchCount", a[0]["status"]);
            })


        // else {
        //     $.when(fetchFiltersCount(recruiterId, jobId, parameters), null).then(function(a,b){
        //         if(a[0] && a[0]["status"] == "success") {
        //             var filtersCount = a[0]['data'];
        //             var data = {
        //                 filtersCount: filtersCount,
        //                 filterFlag: filterFlag
        //             }
        //             return pubsub.publish("fetchedCount", data);
        //         }
        //         return pubsub.publish("failedToFetchCount", a[0]["status"]);
        //     })
        // }


        candidates.addToList(data["data"], data.obj.status, globalParameters.pageNumber, globalParameters.pageContent, filterFlag);

        if(!theJob.getCalendarLength()){
            candidates.setInvite(theJob.getCalendarLength())
        }

        if(data["pageNumber"] == 1) {
            store.emptyStore(data["data"]);
        }
        store.saveToStore(data["data"]);
    }

	function onJobsApplicationsFetchFail(topic, data){
		errorHandler(data)
	}

    function onSuccessfulFetchJobDetails(topic, data) {
        globalParameters.jobId = data["jobId"]
        candidates.setDefaultTab(globalParameters.status)

        var parameters = getQueryParameters()
        parameters.status = globalParameters.status;
        parameters.orderBy = globalParameters.orderBy;
        setQueryParameters(parameters)

        globalParameters.pageNumber = 1;
        parameters.pageNumber = globalParameters.pageNumber;
        parameters.pageContent = globalParameters.pageContent;


        fetchJobApplications(jobId,parameters,recruiterId);
        theJob.setJobDetails(data);
    }

    function onFailedFetchJobDetails(topic, data) {
        console.log(topic)
		console.log(data)
    }

    function onFailCandidateAction(topic,res) {
        errorHandler(res);
        $('.spinner').addClass('hidden');
        $('.shortlist').removeClass('hidden');
        $('.reject').removeClass('hidden');

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
            toastNotify(1, res.applicationId.length +" candidates have been shortlisted and moved to the shortlisted tab.")
            setTimeout(function(){
    			window.location = "/job/"+jobId+"/applications";
    		 }, 2000);

            // candidates.closeModal()
            // if(res.parameters.oldStatus != "") {
            //
            //     candidates.candidateActionTransition(res.applicationId)
            //
            // }
            // fetchJobApplicationCount(recruiterId, jobId)
            // return toastNotify(1, res.applicationId.length +" candidates have been shortlisted")

        }

        if(res.action == "reject") {
            toastNotify(1, res.applicationId.length +" candidates have been rejected and moved to the rejected tab.")
            setTimeout(function(){
    			window.location = "/job/"+jobId+"/applications";
    		 }, 2000);
            // candidates.closeModal()
            // if(res.parameters.oldStatus != "") {
            //
            //     candidates.candidateActionTransition(res.applicationId)
            //     return toastNotify(1, res.applicationId.length +" candidates have been rejected and moved to the rejected tab.")
            // }
            // fetchJobApplicationCount(recruiterId, jobId)
            // return toastNotify(1, res.applicationId.length +" candidates have been rejected")
        }

        if(res.action == "save") {
            toastNotify(1, res.applicationId.length +" candidates have been saved and moved to the saved tab.")
            setTimeout(function(){
    			window.location = "/job/"+jobId+"/applications";
    		 }, 2000);
            // candidates.closeModal()
            // if(res.parameters.oldStatus != "") {
            //     candidates.candidateActionTransition(res.applicationId)
            //     return toastNotify(1, res.applicationId.length +" candidates have been saved and moved to the saved tab.")
            // }
            // fetchJobApplicationCount(recruiterId, jobId)
            // return toastNotify(1, res.applicationId.length +" candidates have been saved")
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
        console.log(data)
        if(data.applicantsCount) {
            candidates.setJobStats(data.applicantsCount);
        }
        if(data.filtersCount) {
            if(data.filterFlag > 0) {
                filters.showResultsFound(data.filtersCount.total);
            }
            candidates.populateCheckInputDropdown(parseInt(data.filtersCount.total), globalParameters.status)
        }
    }

    function onFailedCount(topic, data) {
        errorHandler(data)
    }

    function onSendInterViewInviteSuccess(topic, data) {
        candidates.changeInviteText(data.parameters.applicationId)
        if(data.parameters.inviteId == 1)
            toastNotify(1, "Face to Face Invite Sent Successfully!")
        if(data.parameters.inviteId == 2)
            toastNotify(1, "Telephonic Invite Sent Successfully!")
    }

    function onSendInterViewInviteFail(topic, data) {
        errorHandler(data)
    }

    function onSuccessfulRecommendations(topic, data) {
        aCandidate.addRecommendations()
    }

    function onFailedRecommendation(topic, data) {

    }

    var fetchJobDetailsSubscription = pubsub.subscribe("fetchedJobDetails:"+jobId, onSuccessfulFetchJobDetails)
	var fetchJobDetailsFailSubscription = pubsub.subscribe("failedToFetchJobDetails:"+jobId, onFailedFetchJobDetails);
    var fetchJobApplicationsSuccessSubscription = pubsub.subscribe("fetchedJobApplication", onJobsApplicationsFetchSuccess)
    var fetchJobApplicationsFailSubscription = pubsub.subscribe("failedTofetchJobApplication", onJobsApplicationsFetchFail)
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

    var fetchedCountSuccessSubscription = pubsub.subscribe("fetchedCount", onSuccessfulCount)
	var fetchedCountFailSubscription = pubsub.subscribe("failedToFetchCount", onFailedCount);

    var sendInterViewInviteSuccessSubscription = pubsub.subscribe("sendInterViewInviteSuccess", onSendInterViewInviteSuccess)
	var sendInterViewInviteFailSubscription = pubsub.subscribe("sendInterViewInviteFail", onSendInterViewInviteFail);

    var fetchedRecommendationsSuccessSubscription = pubsub.subscribe("fetchRecommendationsSuccess", onSuccessfulRecommendations)
	var fetchedRecommendationsFailSubscription = pubsub.subscribe("fetchRecommendationsFail", onFailedRecommendation);



    var tickerLock=false;
    $(window).scroll(function() {
        if(!tickerLock){
            tickerLock = true;
            setTimeout(checkScrollEnd,100);
        }
    });

    function checkScrollEnd() {
    	if($(window).scrollTop() + $(window).height() > $(document).height() - 600) {
    		globalParameters.pageNumber = globalParameters.pageNumber + 1;
    		if(globalParameters.candidateListLength >= globalParameters.pageContent) {
                var parameters = filters.getAppliedFilters();
                parameters.pageNumber = globalParameters.pageNumber;
                parameters.pageContent = globalParameters.pageContent;
                parameters.status = globalParameters.status;
                showLoader()
    			fetchJobApplications(jobId,parameters,recruiterId)
    		}
            else
                tickerLock = false;
    	}
        else{
            tickerLock = false
        }
    }
})

function getTitleFormat(title, regex) {
    return title.replace(regex, '');
}

function errorHandler(data) {
    var res = data.responseJSON
    hideLoader()
    if(!res) {

        return toastNotify(3, "Something went wrong");
    }
    return toastNotify(3, res.message);
}

function setQueryParameters(parameters) {
    var array = []
    var i = 0;
    for(var key in parameters) {
        array[i] = (key+'='+parameters[key])
        i++
    }
    page('/?'+array.join("&")+'')
}

function getQueryParameters() {
    var obj = getQueryParameter()
    return obj
}
