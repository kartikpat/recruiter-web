var globalParameters = {
    pageContent: 10,
    pageNumber: 1,
    offset: 0,
    status: "0",
    orderBy: 1,
    initialLoad: 1,
    candidateListLength: null,
    actionPageNumber: 2,
    actionPageContent: 5,
    newApplication: 0 
}
var screenName = "candidate-apply-list";

jQuery(document).ready( function() {
    // creating the instance of models
	var candidates = candidateList();
    var aCandidate = Candidate();
    var chatModule=chatModelIndex();
    var theJob = Job();
    var store = Store();
    var filters = Filters();
    //initializing the models

    candidates.setConfig("jobId", jobId)
    filters.init();
    candidates.init(profile, baseUrl);
    theJob.init();
    aCandidate.init();


    $(window).scroll(function() {  
        if ($(window).scrollTop() > 500 && globalParameters.newApplication==1) {
            candidates.showNewPost();
        } 
        else {
            candidates.hideNewPost();
        }
           
    });

    var obj = getQueryParameters();
    if(obj['status'])
        globalParameters.status = obj['status'];
    if(obj['orderBy'])
        globalParameters.orderBy = obj['orderBy'];
    
    filters.setFilters(obj)
    
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

    // mountint routing
    page.base('/job/'+jobId+'/applications');

    page('/:applicationId', function(context, next){
        var eventObj = {
            event_category: eventMap["viewCandidProfile"]["cat"],
            event_label: 'origin=CandidateApplyList,type=SavedShorlistedList,recId='+recruiterId+''
        }
        sendEvent(eventMap["viewCandidProfile"]["event"], eventObj)
        var applicationId = context.params.applicationId;
        var hash = context.hash || "";

        var parameters = filters.getAppliedFilters()
        parameters.status = globalParameters.status;
        parameters["page"]= "main";
        var queryString=testSetQueryParameters(parameters);
        context.canonicalPath+="?"+queryString;
        context.path+=""+queryString;
        context.querystring+=""+queryString;
        context.state.path+="?"+queryString;
        context.state.path+="?"+queryString;
        var candidateDetails = store.getCandidateFromStore(applicationId);
        aCandidate.showCandidateDetails(candidateDetails,hash, candidateDetails.status);
        // sending event on every view
        // if(parseInt(candidateDetails.status) == 0)
        setCandidateAction(recruiterId, jobId, "view" , applicationId, {});
        return true

    });
    // candidates.onClickCandidate(function(candidateId, status, applicationId){
    //      var eventObj = {
    //         event_category: eventMap["viewCandidProfile"]["cat"],
    //         event_label: 'origin=CandidateApplyList,type=SavedShorlistedList,recId='+recruiterId+''
    //     }
    //     sendEvent(eventMap["viewCandidProfile"]["event"], eventObj)
    //     var candidateDetails = store.getCandidateFromStore(applicationId);
    //     aCandidate.showCandidateDetails(candidateDetails,"", candidateDetails.status);
    //     // sending event on every view
    //     // if(parseInt(candidateDetails.status) == 0)
    //         setCandidateAction(recruiterId, jobId, "view" , applicationId, {});
    //         debugger
    //         return false
    // });

    page('/', function(context, next){
        debugger
        aCandidate.closeModal();
        var parameters = getParametersByString(context.querystring);
        if(parameters['status'])
            globalParameters.status = parameters['status'];
        if(parameters.orderBy)
            globalParameters.orderBy = parameters['orderBy'];
        filters.setFilters(parameters);

        globalParameters.offset = 0;
        parameters.status = globalParameters.status;
        parameters.offset = globalParameters.offset;
        parameters.pageContent = globalParameters.pageContent;

        var tabIndex = 0;
        switch(parameters.status){
            case "0":
                tabIndex=1;
                break;
            case "4,5":
                tabIndex=2;
                break;
            case "1":
                tabIndex=3;
                break;
            case "2":
                tabIndex=4;
                break;
            case "3":
                tabIndex=5;
                break;
            default:
                break;
        };

        candidates.setJqueryTab(tabIndex);
        candidates.showShells(globalParameters.status);
        candidates.removeCandidate(globalParameters.status);
        candidates.hideEmptyScreen();
        fetchJobApplications(jobId, parameters,recruiterId);
    })
    page({dispatch: false});

    filters.addFilterData('industry', industryTagsData);
    filters.addFilterData('functionalArea',functionalAreaTagsData)
    filters.addFilterData('institute', instituteTagsData)
    filters.addFilterData('currentLocation', currentLocationTagsData)
    filters.addFilterData('language', languageTagsData)
    filters.addFilterData('preferredLocation', prefeLocationTagsData);

    filters.onClickApplyFilterButton(function(name){
        var eventObj = {
           event_category: eventMap["applyFilter"]["cat"],
           event_label: 'origin=CandidateApplyList,recId='+recruiterId+''
        }
        sendEvent(eventMap["applyFilter"]["event"], eventObj)
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
        globalParameters.offset = 0;
        parameters.offset = globalParameters.offset;
        parameters.pageContent = globalParameters.pageContent;
        var filterFlag = 0;
        for(var key in parameters) {
          if(!(key == "orderBy" || key == "offset" || key == "pageContent" || key == "status")) {
            filterFlag+= 1;
          }
        }
        if(filterFlag > 0) {
            filters.showAppliedFilters();
        }

        return fetchJobApplications(jobId, parameters, recruiterId)
    });
    filters.onClickRemoveFilter(function(value,category,type){
        var eventObj = {
           event_category: eventMap["crossFilter"]["cat"],
           event_label: 'origin=CandidateApplyList,recId='+recruiterId+''
        }
        sendEvent(eventMap["crossFilter"]["event"], eventObj)
        candidates.showShells(globalParameters.status)
        candidates.removeCandidate(globalParameters.status)
        candidates.hideEmptyScreen()
        filters.removeFilter(value,category,type);
        var parameters = filters.getAppliedFilters();
        parameters.status = globalParameters.status;
        setQueryParameters(parameters);
        globalParameters.offset = 0;
        parameters.offset = globalParameters.offset;
        parameters.pageContent = globalParameters.pageContent;
        return fetchJobApplications(jobId, parameters, recruiterId);
    })

    filters.onClickSearchButton(function(){
        var eventObj = {
           event_category: eventMap["searchFilter"]["cat"],
           event_label: 'origin=CandidateApplyList,recId='+recruiterId+''
        }
        sendEvent(eventMap["searchFilter"]["event"], eventObj);
        var parameters = filters.getAppliedFilters();
        parameters.status = globalParameters.status;
        var queryString = testSetQueryParameters(parameters);
        page('/?'+queryString)
        // fetchJobApplications(jobId, parameters, recruiterId);
    })
    filters.onSelectSortByOption(function(){
        candidates.showShells(globalParameters.status)
        candidates.removeCandidate(globalParameters.status)
        candidates.hideEmptyScreen()
        var parameters = filters.getAppliedFilters();
        parameters.status = globalParameters.status;
        setQueryParameters(parameters);

        globalParameters.offset = 0;
        parameters.offset = globalParameters.offset;
        parameters.pageContent = globalParameters.pageContent;

        return fetchJobApplications(jobId, parameters, recruiterId);
    })
  
    filters.onClickRemoveAllFilters(function(){
        var eventObj = {
           event_category: eventMap["clearFilter"]["cat"],
           event_label: 'origin=CandidateApplyList,recId='+recruiterId+''
        }
        sendEvent(eventMap["clearFilter"]["event"], eventObj)
        candidates.showShells(globalParameters.status)
        candidates.removeCandidate(globalParameters.status)
        candidates.hideEmptyScreen()
        var parameters = filters.getAppliedFilters();
        parameters.status = globalParameters.status;
        setQueryParameters(parameters)
        globalParameters.offset = 0;
        parameters.offset = globalParameters.offset;
        parameters.pageContent = globalParameters.pageContent;
        return fetchJobApplications(jobId, parameters, recruiterId);
    })

    // filters.onClickRemoveSearchFilter(function(){
        
    // })

    
    // candidates.onClickCandidate(function(candidateId, status, applicationId){
    //     var candidateDetails = store.getCandidateFromStore(candidateId);
    //     aCandidate.showCandidateDetails(candidateDetails,"", status);
    //     if(parseInt(status) == 0)
    //         setCandidateAction(recruiterId, jobId, "view" , applicationId, {});
    // });

    candidates.onClickAddTag(function(applicationId) {
        var candidateDetails = store.getCandidateFromStore(applicationId);
        // page('/'+applicationId+'#tag')
    })
    candidates.onClickAddComment(function(applicationId) {
        var candidateDetails = store.getCandidateFromStore(applicationId);
        // page('/'+applicationId+'#comment')
    })
    candidates.onClickViewComment(function(applicationId) {
        var candidateDetails = store.getCandidateFromStore(applicationId);
        // page('/'+applicationId+'#comment')
    })
    candidates.onClickViewTag(function(applicationId) {
         var candidateDetails = store.getCandidateFromStore(applicationId);
        //  page('/'+applicationId+'#tag')
    })

    candidates.onClickSendMessage(function(candidateId,applicationId){
        var eventObj = {
           event_category: eventMap["initiateConver"]["cat"],
           event_label: 'origin=CandidateApplyList,recId='+recruiterId+''
        }
        sendEvent(eventMap["initiateConver"]["event"], eventObj)
        var candidate = store.getCandidateFromStore(applicationId);
        var array = [];
        array.push(candidate);
        chatModule.createNewChannel(recruiterId,jobId,applicationId,array);
    })


    aCandidate.onClickChatCandidateModal(function(candidateId,applicationId){
        var eventObj = {
           event_category: eventMap["initiateConver"]["cat"],
           event_label: 'origin=Profile,recId='+recruiterId+''
        }
        sendEvent(eventMap["initiateConver"]["event"], eventObj)
        var candidate = store.getCandidateFromStore(applicationId);
        var array = [];
        array.push(candidate);
        chatModule.createNewChannel(recruiterId,jobId,applicationId,array);
    })


    aCandidate.onClickSeeMoreRec(function() {
        // fetchRecommendations(recruiterId)
    })

    aCandidate.onClickSendInterviewInviteF2F(function(applicationId, inviteId){
        var eventObj = {
           event_category: eventMap["sendInvite"]["cat"],
           event_label: 'origin=Profile,type=F2F,recId='+recruiterId+''
        }
        sendEvent(eventMap["sendInvite"]["event"], eventObj)
        // console.log('here')
        if($(".candidateRow[data-application-id="+applicationId+"]").find('.inviteF2f').attr('state')=='default'){
            var defaultCalendarId = theJob.getDefaultCalendar();
            if(!defaultCalendarId)
                return theJob.openSelectDefaultCalendarModal();
            var obj = {
                "type": inviteId,
                "calendarId": theJob.getSelectedCalendarId()
            }
            $(".candidateRow[data-application-id="+applicationId+"]").find('.invite').attr('state','clicked')
            $(".candidateRow[data-application-id="+applicationId+"]").find('.inviteF2f .loadingScroller').removeClass('hidden');
            sendInterViewInvite(recruiterId, jobId, applicationId , obj)
        }
    })

    aCandidate.onClickSendInterviewInviteTelephonic(function(applicationId, inviteId){
        var eventObj = {
           event_category: eventMap["sendInvite"]["cat"],
           event_label: 'origin=Profile,type=Telephonic,recId='+recruiterId+''
        }
        sendEvent(eventMap["sendInvite"]["event"], eventObj)
        if($(".candidateRow[data-application-id="+applicationId+"]").find('.inviteTelephonic').attr('state')=='default'){
            var defaultCalendarId = theJob.getDefaultCalendar();
            if(!defaultCalendarId)
                return theJob.openSelectDefaultCalendarModal();
            var obj = {
                "type": inviteId,
                "calendarId": theJob.getSelectedCalendarId()
            }
            $(".candidateRow[data-application-id="+applicationId+"]").find('.invite').attr('state','clicked')
            $(".candidateRow[data-application-id="+applicationId+"]").find('.inviteTelephonic .loadingScroller').removeClass('hidden');
            sendInterViewInvite(recruiterId, jobId, applicationId , obj)
        }
    })

    candidates.onClickSendInterviewInviteF2F(function(applicationId, inviteId){
        var eventObj = {
           event_category: eventMap["sendInvite"]["cat"],
           event_label: 'origin=CandidateApplyList,type=F2F,recId='+recruiterId+''
        }
        sendEvent(eventMap["sendInvite"]["event"], eventObj)
        if($(".candidateRow[data-application-id="+applicationId+"]").find('.inviteF2f').attr('state')=='default') {
                var defaultCalendarId = theJob.getDefaultCalendar();
                if(!defaultCalendarId)
                    return theJob.showCalendarMissingError();
                var obj = {
                    "type": inviteId,
                    "calendarId": theJob.getSelectedCalendarId()
                }
                $(".candidateRow[data-application-id="+applicationId+"]").find('.invite').attr('state','clicked')
                $(".candidateRow[data-application-id="+applicationId+"]").find('.inviteF2f .loadingScroller').removeClass('hidden');
                sendInterViewInvite(recruiterId,jobId,applicationId,obj)
        }
    })

    candidates.onClickSendInterviewInviteTelephonic(function(applicationId, inviteId){
        var eventObj = {
           event_category: eventMap["sendInvite"]["cat"],
           event_label: 'origin=CandidateApplyList,type=Telephonic,recId='+recruiterId+''
        }
        sendEvent(eventMap["sendInvite"]["event"], eventObj)
        if($(".candidateRow[data-application-id="+applicationId+"]").find('.inviteTelephonic').attr('state')=='default'){
            var defaultCalendarId = theJob.getDefaultCalendar();
            if(!defaultCalendarId)
                return theJob.showCalendarMissingError();
            var obj = {
                "type": inviteId,
                "calendarId": theJob.getSelectedCalendarId()
            }
            $(".candidateRow[data-application-id="+applicationId+"]").find('.invite').attr('state','clicked')
            $(".candidateRow[data-application-id="+applicationId+"]").find('.inviteTelephonic .loadingScroller').removeClass('hidden');
            sendInterViewInvite(recruiterId, jobId, applicationId , obj)
        }
    })
         candidates.onChangeCandidateCheckbox(function(candidateId){
    })

    candidates.initializeJqueryTabs(defaultTabObj[globalParameters.status], function(event, ui) {
        var status = candidates.activateStatsTab(event, ui);
        return true;
    }, function(event, ui){
        var status = candidates.getActiveTab(ui);
        var parameters = filters.getAppliedFilters();
        globalParameters.status = status;
        parameters.status = globalParameters.status;
        var queryString = testSetQueryParameters(parameters);
        page('/?'+queryString);
        return true
    });

    candidates.onClickNewPost(function(){
        var status = globalParameters.status;
        candidates.showShells(status);
        candidates.removeCandidate(status)
        var parameters = filters.getAppliedFilters();
        parameters.status = globalParameters.status;
        setQueryParameters(parameters);
        globalParameters.newApplication=0;
        globalParameters.offset = 0;
        parameters.offset = globalParameters.offset;
        parameters.pageContent = globalParameters.pageContent;
        $(window).scrollTop(0)
        fetchJobApplications(jobId, parameters,recruiterId);     
    })

    candidates.onClickDownloadResume(function(applicationId, status){
        var eventObj = {
           event_category: eventMap["downloadResume"]["cat"],
           event_label: 'origin=CandidateApplyList,type=Single,recId='+recruiterId+''
        }
        sendEvent(eventMap["downloadResume"]["event"], eventObj)
        // sending event on every download
        // if(parseInt(status) == 0)
            setCandidateAction(recruiterId, jobId, "download" , applicationId, {});
    });

    aCandidate.onClickDownloadResume(function(applicationId, status){
        var eventObj = {
           event_category: eventMap["downloadResume"]["cat"],
           event_label: 'origin=Profile,type=Single,recId='+recruiterId+''
        }
        sendEvent(eventMap["downloadResume"]["event"], eventObj)
        // if(parseInt(status) == 0)
        // sending event on every download
            setCandidateAction(recruiterId, jobId, "download" , applicationId, {});
    });

    candidates.onClickSaveCandidate(function(applicationId, newStatus, dataAction){
        var eventObj = {
           event_category: eventMap["saveCand"]["cat"],
           event_label: 'origin=CandidateApplyList,type=Single,recId='+recruiterId+''
        }
        sendEvent(eventMap["saveCand"]["event"], eventObj)
        $(".candidateRow[data-application-id="+applicationId+"]").find('.candidateSave .loadingScroller').removeClass('hidden');
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
        var eventObj = {
           event_category: eventMap["shortlistCand"]["cat"],
           event_label: 'origin=CandidateApplyList,type=Single,recId='+recruiterId+''
       }
       sendEvent(eventMap["shortlistCand"]["event"], eventObj)
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
        // TODO
        arr.push(res.applicationId)
        if(res.action == "view") {
            var newStatus = 4
            var obj = store.getCandidateFromStore(res.applicationId)
            obj["status"] = (obj["status"]==1 || obj["status"]==2 || obj["status"]==3) ? obj["status"] : newStatus;
            return candidates.changeStatus(arr, obj["status"])
        }

        if(res.action == "download") {
            var newStatus = 5
            var obj = store.getCandidateFromStore(res.applicationId)
            obj["status"] = (obj["status"]==1 || obj["status"]==2 || obj["status"]==3) ? obj["status"] : newStatus;
            return candidates.changeStatus(arr, obj["status"])
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
                var obj = store.getCandidateFromStore(res.applicationId)
                obj["tags"].push(tag)
                aCandidate.appendCandidateTag(tag)
                candidates.appendCandidateTag(tag,res.applicationId);

                candidates.showTag(res.applicationId, obj["comment"]);
                return toastNotify(1, "Tag Added Successfully")
            }
            var tagId = res.parameters.tagId
            var obj = store.getCandidateFromStore(res.applicationId)
            obj["tags"].pop(tag)
            aCandidate.removeTag(tagId)
            candidates.removeTag(tagId)
            return toastNotify(1, "Tag Deleted Successfully")
        }

        if(res.action == "comment") {
            var obj = store.getCandidateFromStore(res.applicationId)
            obj["comment"] = res.comment;
            aCandidate.addComment(res.comment);
            candidates.addComment(res.comment,res.applicationId);
            var tagLen = obj["tags"].length;
            candidates.showComment(res.applicationId, tagLen);
            return toastNotify(1, "Comment Added Successfully")
        }

        if(res.parameters.oldStatus != "" && !res.parameters.isModalButton) {
            candidates.candidateActionTransition(arr)
            globalParameters.offset = globalParameters.offset - 1;
            checkApplicationLength()
        }

        if(res.action == "unread") {
            $('.spinner').addClass('hidden');
            $('.shortlist').removeClass('hidden');
            $('.reject').removeClass('hidden');
            var newStatus = 0
            if(res.parameters.isModalButton) {
                // candidates.changeButtonText(arr, newStatus, res.parameters.dataAction)
                aCandidate.changeButtonText(arr, newStatus, res.parameters.dataAction)
                // return toastNotify(1, "Moved to Unread Tab")
            }

            // if(res.parameters.oldStatus != "") {
            //     return toastNotify(1, "Moved to Unread Tab")
            // }

            var obj = store.getCandidateFromStore(res.applicationId)
            obj["status"] = newStatus;
            candidates.changeButtonText(arr, newStatus, res.parameters.dataAction)
            return toastNotify(1, "Moved to Unread Tab")
        }
        if(res.action == "shortlist") {
            $('.spinner').addClass('hidden');
            $('.shortlist').removeClass('hidden');
            var newStatus = 1
            if(res.parameters.isModalButton) {
                aCandidate.changeButtonText(arr, newStatus, res.parameters.dataAction)
            }
            var obj = store.getCandidateFromStore(res.applicationId)
            obj["status"] = newStatus;
            candidates.changeButtonText(arr,newStatus, res.parameters.dataAction)
            return toastNotify(1, "Moved to Shortlisted Tab")
        }
        if(res.action == "reject") {
            $('.spinner').addClass('hidden');
            $('.reject').removeClass('hidden');
            var newStatus = 2
            if(res.parameters.isModalButton) {
                aCandidate.changeButtonText(arr, newStatus, res.parameters.dataAction)
            }
            var obj = store.getCandidateFromStore(res.applicationId)
            obj["status"] = newStatus;
            candidates.changeButtonText(arr, newStatus, res.parameters.dataAction)
            return toastNotify(1, "Moved to Rejected Tab")
        }        
        if(res.action == "save") {
            $(".candidateRow[data-application-id="+res.applicationId+"]").find('.candidateSave .loadingScroller').addClass('hidden');
            var newStatus = 3
            if(res.parameters.isModalButton) {
                // candidates.changeButtonText(arr, newStatus, res.parameters.dataAction)
                aCandidate.changeButtonText(arr, newStatus, res.parameters.dataAction)
                // return toastNotify(1, "Moved to Saved Tab")
            }

            // if(res.parameters.oldStatus != "") {
            //     return toastNotify(1, "Moved to Saved Tab")
            // }
            var obj = store.getCandidateFromStore(res.applicationId)
            obj["status"] = newStatus;
            candidates.changeButtonText(arr,newStatus, res.parameters.dataAction)
            return toastNotify(1, "Moved to Saved Tab")
        }

    }

    function checkApplicationLength() {

        var length = candidates.getApplicationsLength()

        if(length <= 5 && globalParameters.candidateListLength == globalParameters.pageContent) {
            var parameters = filters.getAppliedFilters();
            parameters.status = globalParameters.status;
            setQueryParameters(parameters);
            parameters.offset = globalParameters.offset;
            parameters.pageContent = globalParameters.pageContent;
            showLoader()
            fetchJobApplications(jobId, parameters,recruiterId);
        }
    }

    candidates.onClickRejectCandidate(function(applicationId, newStatus, dataAction){
        var eventObj = {
           event_category: eventMap["rejectCand"]["cat"],
           event_label: 'origin=CandidateApplyList,type=Single,recId='+recruiterId+''
        }
        sendEvent(eventMap["rejectCand"]["event"], eventObj)
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

    candidates.onClickDownloadMassExcel(function(arr, from, to, requestType) {
        var parameters = filters.getAppliedFilters();
        parameters.status = globalParameters.status;
        if(requestType == "bulkRequestDropdown") {
            parameters.offset = parseInt(from) - 1;
            parameters.pageContent = parseInt(to - (from - 1));

        }
        else {
            if(arr.length<1){
                toastNotify(3, "Please select at least 1 candidate");
                return false;
            }
            parameters.applicationId = arr.toString();
        }
        var str = "?"
        for(var key in parameters) {
            str+= key + "=" + parameters[key] + "&";
        }
        candidates.setHref(str)
        return true;
    })

    candidates.onClickDownloadMassResume(function(arr,from, to, requestType){
        var eventObj = {
           event_category: eventMap["downloadResume"]["cat"],
           event_label: 'origin=CandidateApplyList,type=Bulk,recId='+recruiterId+''
        }
        sendEvent(eventMap["downloadResume"]["event"], eventObj)
        var data = {}
        if(requestType == "bulkRequestDropdown") {
            data = filters.getAppliedFilters();
            data.offset = parseInt(from) - 1;
            data.pageContent = parseInt(to - (from - 1));
            data.status = globalParameters.status;
            // parameters.status = globalParameters.status;
            // parameters.length = (to - from) + 1;
        }
        else {
            if(arr.length > 100) {
                return toastNotify(3, "You can't download more than 100 resumes at a time.")
            }
            if(arr.length<1){
                return toastNotify(3, "Please select at least 1 candidate");
            }
            data.applicationId = arr.toString()
            // parameters.oldStatus = globalParameters.status
            // parameters.newStatus = newStatus
            // parameters.length = applicationIds.length
        }
        downloadMassResume(recruiterId, jobId, data)
        return true;
    })

    candidates.onClickMassActionButton(function(applicationIds, action, comment, newStatus, typeRequest, from, to){
        if(action == "shortlist") {
            var eventObj = {
    			event_category: eventMap["shortlistCand"]["cat"],
    			event_label: 'origin=CandidateApplyList,type=Bulk,recId='+recruiterId+''
    		}
    		sendEvent(eventMap["shortlistCand"]["event"], eventObj)
        }
        else if (action == "reject") {
            var eventObj = {
    			event_category: eventMap["rejectCand"]["cat"],
    			event_label: 'origin=CandidateApplyList,type=Bulk,recId='+recruiterId+''
    		}
    		sendEvent(eventMap["rejectCand"]["event"], eventObj)
        }
        else if (action == "save") {
            var eventObj = {
    			event_category: eventMap["saveCand"]["cat"],
    			event_label: 'origin=CandidateApplyList,type=Bulk,recId='+recruiterId+''
    		}
    		sendEvent(eventMap["saveCand"]["event"], eventObj)
        }

        var data = {}
        var parameters = {};

        if(typeRequest == "bulkRequestDropdown") {
            data = filters.getAppliedFilters();
            data.offset = parseInt(from) - 1;
            data.pageContent = parseInt(to - (from - 1));
            data.status = globalParameters.status;
            parameters.status = globalParameters.status;
            parameters.length = (to - from) + 1;
        }
        else {
            if(applicationIds.length<1){
                return toastNotify(3, "Please select at least 1 candidate");
            }
            data.applicationId = applicationIds
            parameters.oldStatus = globalParameters.status
            parameters.newStatus = newStatus
            parameters.length = applicationIds.length
        }
        if(comment != '') {
            data.comment = comment;
        }
        setBulkCandidateActions(recruiterId, jobId, action, data, parameters)
    })

    theJob.onClickSubmitUnpublishJob(function(reason){
        var eventObj = {
			event_category: eventMap["jobUnpublishClick"]["cat"],
			event_label: 'origin=CandidateApplyList,recId='+recruiterId+''
		}
		sendEvent(eventMap["jobUnpublishClick"]["event"], eventObj)
        theJob.showSpinner("unpublish");
		return submitUnpublishJob(recruiterId, globalParameters.jobId, {reasonId: reason});
	});
	theJob.onClickSubmitRefreshJob(function(jobId){
        var eventObj = {
			event_category: eventMap["jobRefreshClick"]["cat"],
			event_label: 'origin=CandidateApplyList,recId='+recruiterId+''
		}
		sendEvent(eventMap["jobRefreshClick"]["event"], eventObj)
        theJob.showSpinner("refresh");
		return submitRefreshJob(recruiterId,jobId);
	})
    theJob.onClickSubmitPremiumJob(function(){
        theJob.showSpinner("premium");
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
        $('.calendarSelect').prop('disabled', true);
        setDefaultCalendar( recruiterId, jobId, calendarId, obj, {})
    })

     aCandidate.onClickAddTag(function(applicationId, parameters){
         var eventObj = {
            event_category: eventMap["tagAdd"]["cat"],
            event_label: 'origin=Profile,method=ButtonClick,recId='+recruiterId+''
         }
         sendEvent(eventMap["tagAdd"]["event"], eventObj)
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

     candidates.onClickTag(function(applicationId, parameters){
         var eventObj = {
            event_category: eventMap["tagAdd"]["cat"],
            event_label: 'origin=CandidateApplyList,method=ButtonClick,recId='+recruiterId+''
         }
         sendEvent(eventMap["tagAdd"]["event"], eventObj)
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

     candidates.onClickDeleteTag(function(applicationId, tagId){
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
         var eventObj = {
            event_category: eventMap["commentAdd"]["cat"],
            event_label: 'origin=Profile,method=ButtonClick,recId='+recruiterId+''
         }
         sendEvent(eventMap["commentAdd"]["event"], eventObj)
         var parameters = {}
         var ob = {
             "comment": comment
         }
         setCandidateAction(recruiterId, jobId, "comment" ,applicationId,ob );
     })

     candidates.onClickComment(function(applicationId,comment){
         var eventObj = {
            event_category: eventMap["commentAdd"]["cat"],
            event_label: 'origin=CandidateApplyList,method=ButtonClick,recId='+recruiterId+''
         }
         sendEvent(eventMap["commentAdd"]["event"], eventObj)
        var parameters = {}
        var ob = {
            "comment": comment
        }
         setCandidateAction(recruiterId, jobId, "comment" , applicationId, ob);
     })

     aCandidate.onClickAddCommentMob(function(applicationId, comment){
         var eventObj = {
            event_category: eventMap["commentAdd"]["cat"],
            event_label: 'origin=Profile,method=ButtonClick,recId='+recruiterId+''
         }
         sendEvent(eventMap["commentAdd"]["event"], eventObj)
         var parameters = {}
         var ob = {
             "comment": comment
         }
         setCandidateAction(recruiterId, jobId, "comment" , applicationId, ob);
     })

     aCandidate.onClickAddTagMob(function(applicationId, parameters){
         var eventObj = {
            event_category: eventMap["tagAdd"]["cat"],
            event_label: 'origin=Profile,method=ButtonClick,recId='+recruiterId+''
         }
         sendEvent(eventMap["tagAdd"]["event"], eventObj)
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
         var eventObj = {
 			event_category: eventMap["shortlistCand"]["cat"],
 			event_label: 'origin=Profile,type=Single,recId='+recruiterId+''
 		}
 		sendEvent(eventMap["shortlistCand"]["event"], eventObj)
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
         var eventObj = {
 			event_category: eventMap["rejectCand"]["cat"],
 			event_label: 'origin=Profile,type=Single,recId='+recruiterId+''
 		}
 		sendEvent(eventMap["rejectCand"]["event"], eventObj)
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
         var eventObj = {
             event_category: eventMap["saveCand"]["cat"],
             event_label: 'origin=Profile,type=Single,recId='+recruiterId+''
         }
         sendEvent(eventMap["saveCand"]["event"], eventObj)
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
             if(jobRow["refreshId"]) {
                 window.location.href = "/job/"+jobRow["refreshId"]+"/applications";
             }
             $('.titlePage').text("Applications-" +jobRow["title"]+"| iimjobs.com");
              var data = {
                jobTitle: getTitleFormat(jobRow["title"],(/\(\d+-\d+ \w+\)$/)),
                jobLocation: getLocation(jobRow["location"]),
                jobOtherLocation:jobRow["otherLocation"],
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

     },function(res,status, error) {
         return pubsub.publish("failedToFetchJobDetails:"+jobId, res);
     });


    function onJobsApplicationsFetchSuccess(topic, data) {
        tickerLock = false;
        hideLoader()
        globalParameters.candidateListLength = data["data"].length;

        if(data["offset"] == 0) {
            store.emptyStore(data["data"]);
        }
        var filterFlag = 0;
        var parameters = filters.getAppliedFilters();
        parameters.status = globalParameters.status;
        for(var key in parameters) {
            if(!(key == "orderBy" || key == "offset" || key == "pageContent" || key == "status")) {
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

        var dataArray=(data["data"]);
        var newApplication=[];
        dataArray.forEach(function(aData){ 
            var applicationId=aData["id"];
            if(!(store.getCandidateFromStore(applicationId))){
                newApplication.push(aData);
            }
            else{
                globalParameters.newApplication=1;
            }
        });
        store.saveToStore(newApplication);        
        candidates.addToList(newApplication,data.obj.status, globalParameters.offset, globalParameters.pageContent, filterFlag);
        globalParameters.offset = globalParameters.offset + globalParameters.pageContent;
        var calLength = theJob.getCalendarLength()
        if(!calLength){
            candidates.setInvite(theJob.getCalendarLength())
        }
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

        globalParameters.offset = 0;
        parameters.offset = globalParameters.offset;
        parameters.pageContent = globalParameters.pageContent;

        fetchJobApplications(jobId,parameters,recruiterId);
        theJob.setJobDetails(data);
    }

    function onFailedFetchJobDetails(topic, data) {
        errorHandler(data)
    }

    function onFailCandidateAction(topic,res) {
        $(".candidateRow[data-application-id="+res.applicationId+"]").find('.candidateSave .loadingScroller').addClass('hidden');
        $('.spinner').addClass('hidden');
        $('.shortlist').removeClass('hidden');
        $('.reject').removeClass('hidden');
        if(res.action == "view") {
            return
        }
        errorHandler(res);
    }

    function onSuccessfullFetchedTag(topic, res) {
        aCandidate.showDropdownTags(res["data"]);
        candidates.showDropdownTags(res["data"]);
    }

    function onFailFetchedTag(topic, res) {
        errorHandler(res);
    }

    function onSuccessfullSetDefaultCalendar(topic, res) {
        $('.calendarSelect').prop("disabled",false);
        theJob.setDefaultCalendar(res.data)
        theJob.closeCalendarModal()
        theJob.setSelectedCalendarId(parseInt(res.calendarId))
        toastNotify(1, "Default Calendar Set.")
    }

    function onFailSetDefaultCalendar(topic, res) {
        $('.calendarSelect').prop("disabled",false);
        theJob.setSelectedCalendarId(-1)
        errorHandler(res);
    }

    function onSuccessfullCandidateBulkAction(topic,res) {
        if(res.action == "comment") {
            candidates.closeModal()
            toastNotify(1, "Comment added to " + res.parameters.length +" candidates")
            setTimeout(function(){
    			window.location = "/job/"+jobId+"/applications";
    		 }, 2000);
        }

        if(res.action == "shortlist") {
            toastNotify(1, res.parameters.length +" candidates have been shortlisted and moved to the shortlisted tab.")
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
            toastNotify(1, res.parameters.length +" candidates have been rejected and moved to the rejected tab.")
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
            toastNotify(1, res.parameters.length +" candidates have been saved and moved to the saved tab.")
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
        return toastNotify(1, "You will shortly receive an email with the download link!")
    }

    function onDownloadFail(topic, res) {

        if(res.status == 403 && res.responseJSON && res.responseJSON.code == 4032) {
            var msg = "Your daily limit of bulk resume has expired!"
            if(res.responseJSON && res.responseJSON.data)
                msg +=  "Only "+res.responseJSON.data+" left."
            return toastNotify(3, msg);
        }
        if(res.status == 403 && res.responseJSON && res.responseJSON.code == 4031) {
            var msg = "You don't have access to this plan!"
            return toastNotify(3, msg);
        }
        if(res.status == 409) {
            var msg = "You have already requested a download for these resumes. You request is in process!"
            return toastNotify(3, msg);
        }
        errorHandler(res)
    }

    function onSuccessfulUnpublishedJob(topic, data) {
        theJob.hideSpinner("unpublish")
        theJob.closeModal()
		toastNotify(1, "Job Unpublished Successfully")
		setTimeout(function(){
			 location.reload()
		 }, 2000);
	}

	function onFailedUnpublishedJob(topic,data) {
        theJob.hideSpinner("unpublish")
		errorHandler(data)
	}
	function onSuccessfulRefreshJob(topic, data){
        theJob.hideSpinner("refresh")
        theJob.closeModal()
        toastNotify(1, "Job Refreshed Successfully")
        setTimeout(function(){
             location.reload()
         }, 2000);
	}

	function onFailedRefreshJob(topic, data){
        theJob.hideSpinner("refresh")
		errorHandler(data)
	}

	function onSuccessfulPremiumJob(topic, data){
        theJob.hideSpinner("premium")
        theJob.closeModal()
        toastNotify(1, "Job Made Premium Successfully")
        setTimeout(function(){
             location.reload()
         }, 2000);
	}

	function onFailedPremiumJob(topic, data){
        theJob.hideSpinner("premium")
		errorHandler(data)
	}

    function onSuccessfulCount(topic, data) {

        if(data.applicantsCount) {
            candidates.setJobStats(data.applicantsCount);
        }
        if(data.filtersCount) {
            if(data.filterFlag > 0) {
                filters.showResultsFound(data.filtersCount.total);
            }
            else {
                filters.hideResultsFound()
            }
            candidates.populateCheckInputDropdown(parseInt(data.filtersCount.total), globalParameters.status)
        }
    }

    function onFailedCount(topic, data) {
        errorHandler(data)
    }

    function onSendInterViewInviteSuccess(topic, data){
        var applicationId=data['parameters']['applicationId'];
        candidates.changeInviteText(data.parameters.applicationId)
        var obj = store.getCandidateFromStore(data.parameters.applicationId)
        if(data.parameters.inviteId == 1){
            toastNotify(1, "Face to Face Invite Sent Successfully!")
            $(".candidateRow[data-application-id="+applicationId+"]").find('.inviteF2f .icon-container').removeClass('hidden');
            $(".candidateRow[data-application-id="+applicationId+"]").find('.inviteF2f .loadingScroller').addClass('hidden');
            obj["isSent"] =1;
        }
        if(data.parameters.inviteId == 2){
            toastNotify(1, "Telephonic Invite Sent Successfully!")
            $(".candidateRow[data-application-id="+applicationId+"]").find('.inviteTelephonic  .icon-container').removeClass('hidden');
            $(".candidateRow[data-application-id="+applicationId+"]").find('.inviteTelephonic .loadingScroller').addClass('hidden');
            obj["isSent"] =2;
        }
    }

    function onSendInterViewInviteFail(topic, data){
        if(data.status == 400 && data.responseJSON && data.responseJSON.code == 4001) {
            return window.location.href = "/calendar/"+data.parameters.calendarId+"/edit?insuffSlotsErrMsg=1";
        }

        var applicationId=data['parameters']['applicationId'];
        $(".candidateRow[data-application-id="+applicationId+"]").find('.invite .loadingScroller').addClass('hidden');
        $(".candidateRow[data-application-id="+applicationId+"]").find('.inviteF2f').attr('state','default');
        $(".candidateRow[data-application-id="+applicationId+"]").find('.inviteTelephonic').attr('state','default');
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
    		if(globalParameters.candidateListLength == globalParameters.pageContent) {
                var parameters = filters.getAppliedFilters();
                parameters.offset = globalParameters.offset;
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
    if(data.status == 401) {
        return window.location = staticEndPoints.dashboard
    }
    if(data.status == 404) {
        toastNotify(3, "Page not found");
        setTimeout(function(){
			 window.location.href = staticEndPoints.dashboard
		 }, 2000);
         return
    }
    if(data.status == 503) {
        toastNotify(3, "Oops...something went wrong. Our engineers are fixing the issue");
         return
    }
    var res = data.responseJSON
    hideLoader()
    if(!res) {
        $('.loadingScroller').addClass('hidden');
        $('.invite').attr('state','default');
        return toastNotify(3, "Looks like you are not connected to the internet");
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

function testSetQueryParameters(parameters){
    var array = []
    var i = 0;
    for(var key in parameters) {
        array[i] = (key+'='+parameters[key])
        i++
    }
    return array.join("&");
    // page('/?'+array.join("&")+'')   
}

function getQueryParameters() {
    var obj = getQueryParameter()
    return obj
}
