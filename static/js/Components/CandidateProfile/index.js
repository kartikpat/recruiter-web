var globalParameters = {
    pageContent: 10,
    pageNumber: 1,
    status: "",
    orderBy: 1,
    initialLoad: 1,
    candidateListLength: null
}

var screenName = "candidate-profile";
jQuery(document).ready( function() {
    // creating the instance of models
    var aCandidate = Candidate();
    var store = Store();
    var chatModule=chatModelIndex();
    chatModule.init();
    //initializing the models
    aCandidate.init();
    page('/job/'+jobId+'/applications', function(context, next){
        window.location.href='/job/'+jobId+'/applications?'+context.querystring;
        return
    })
    page();
    var successMsg = getQueryParameter("type");
    var successRef= getQueryParameter("ref");

    fetchCandidateProfile(recruiterId, jobId, applicationId)
    submitPageVisit(recruiterId, screenName, jobId);
    var pageVisitSubscriptionSuccess = pubsub.subscribe("pageVisitSuccess:"+screenName, onPageVisitUpdateSuccess)
    var pageVisitSubscriptionSuccess = pubsub.subscribe("pageVisitFail:"+screenName, onPageVisitUpdateFail)
    function onPageVisitUpdateSuccess(topic, data){
        console.log('page visit done');
    }
    function onPageVisitUpdateFail(topic, data){
        console.log('page visit error');
    }

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

     aCandidate.onClickSeeMoreRec(function() {
         // fetchRecommendations(recruiterId)
     })

     aCandidate.onClickShortlistCandidate(function(applicationId, newStatus, dataAction) {
         var eventObj = {
           event_category: eventMap["shortlistCand"]["cat"],
           event_label: 'origin=Profile,type=Single,recId='+recruiterId+''
         }

         if(successRef=="Email"){
            eventObj.event_label='origin=Email,type=Single,recId='+recruiterId+''
         }

         sendEvent(eventMap["shortlistCand"]["event"], eventObj)
         var action;
         $('.candidateShortlistModal').prev().removeClass('hidden');
         $('.candidateShortlistModal').addClass('hidden');

         if(parseInt(dataAction) == parseInt(newStatus)) {
             action = "unread"
         }
         else {
             action = "shortlist"
         }
         var parameters = {};
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
         if(successRef=="Email"){
            eventObj.event_label='origin=Email,type=Single,recId='+recruiterId+''
         }
         sendEvent(eventMap["rejectCand"]["event"], eventObj)
         var action;
         $('.candidateRejectModal').prev().removeClass('hidden');
         $('.candidateRejectModal').addClass('hidden');
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
         if(successRef=="Email"){
            eventObj.event_label='origin=Email,type=Single,recId='+recruiterId+''
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

     aCandidate.onClickChatCandidateModal(function(candidateId,applicationId) {
         var candidate = store.getCandidateFromStore(applicationId);
         var array = [];
         array.push(candidate);
         chatModule.createNewChannel(recruiterId,jobId,applicationId,array);
     })

    function onCandidateProfileFetchSuccess(topic, res) {
        console.log(res.data)
        store.saveToStore(res.data)

        aCandidate.populateCandidateData(res.data[0])
        if(successMsg!="download"){
            setCandidateAction(recruiterId, jobId, "view" , applicationId, {});
        }
        if(successMsg=="download"){
            aCandidate.triggerDownload();
        }
        fetchjobCalendars(jobId, recruiterId)
    }

   function onCandidateProfileFetchFail(topic, data){
       errorHandler(data)
   }

    function onSuccessfullCandidateAction(topic, res) {

        if(res.action == "view") {
            var newStatus = 4
            var obj = store.getCandidateFromStore(res.applicationId)
            obj["status"] = newStatus;
        }

        if(res.action == "download") {
            var newStatus = 5
            return aCandidate.changeStatus( newStatus)
        }
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
            aCandidate.addComment(res.comment)
            return toastNotify(1, "Comment Added Successfully")
        }
        var arr = [];
        arr.push(res.applicationId)
        if(res.action == "unread") {
            $('.spinner').addClass('hidden');
            $('.candidateShortlistModal').removeClass('hidden');
            $('.candidateRejectModal').removeClass('hidden');
            var newStatus = 0
            if(res.parameters.isModalButton) {

                aCandidate.changeButtonText(arr, newStatus, res.parameters.dataAction)
                return toastNotify(1, "Moved to Unread Tab")
            }
        }
        if(res.action == "shortlist") {
            $('.spinner').addClass('hidden');
            $('.candidateShortlistModal').removeClass('hidden');
            var newStatus = 1
            if(res.parameters.isModalButton) {

                aCandidate.changeButtonText(arr, newStatus, res.parameters.dataAction)
                return toastNotify(1, "Moved to Shortlisted Tab")
            }
        }
        if(res.action == "reject") {
            $('.spinner').addClass('hidden');
            $('.candidateRejectModal').removeClass('hidden');
            var newStatus = 2
            if(res.parameters.isModalButton) {

                aCandidate.changeButtonText(arr, newStatus, res.parameters.dataAction)
                return toastNotify(1, "Moved to Rejected Tab")
            }
        }
        if(res.action == "save") {
            var newStatus = 3
            if(res.parameters.isModalButton) {

                aCandidate.changeButtonText(arr, newStatus, res.parameters.dataAction)
                return toastNotify(1, "Moved to Saved Tab")
            }
        }
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

    function onSuccessfullFetchedCalendars(topic, res) {
        if(!res.length){
            return aCandidate.setInvite()
        }
        store.saveCalendarsToStore(res)
    }

    function onFailFetchedCalendars(topic,res) {
        errorHandler(res);
    }

    aCandidate.onClickSendInterviewInviteF2F(function(applicationId, inviteId){
        var eventObj = {
           event_category: eventMap["sendInvite"]["cat"],
           event_label: 'origin=Profile,type=F2F,recId='+recruiterId+''
        }
        sendEvent(eventMap["sendInvite"]["event"], eventObj)
        // if(!defaultCalendarId)
            // return aCandidate.openSelectDefaultCalendarModal();
        // var obj = {
        //     "type": inviteId,
        //     "calendarId": store.getCalendarId()
        // }
        if($(".candidateDetailsModal[data-application-id="+applicationId+"]").find('.inviteF2f').attr('state')=='default'){
            var defaultCalendarId = store.getDefaultId();
            if(!defaultCalendarId)
                return aCandidate.openSelectDefaultCalendarModal();
            var obj = {
                "type": inviteId,
                "calendarId": store.getCalendarId()
            }
            $(".candidateDetailsModal[data-application-id="+applicationId+"]").find('.invite').attr('state','clicked')
            $(".candidateDetailsModal[data-application-id="+applicationId+"]").find('.inviteF2f .loadingScroller').removeClass('hidden');
            sendInterViewInvite(recruiterId, jobId, applicationId , obj)
        }
    })

    aCandidate.onClickSendInterviewInviteTelephonic(function(applicationId, inviteId){
        var eventObj = {
           event_category: eventMap["sendInvite"]["cat"],
           event_label: 'origin=Profile,type=Telephonic,recId='+recruiterId+''
        }
        sendEvent(eventMap["sendInvite"]["event"], eventObj)

        // if(!defaultCalendarId)
        //     return aCandidate.openSelectDefaultCalendarModal();
        // var obj = {
        //     "type": inviteId,
        //     "calendarId": store.getCalendarId()
        // }
        if($(".candidateDetailsModal[data-application-id="+applicationId+"]").find('.inviteTelephonic').attr('state')=='default'){
            var defaultCalendarId = store.getDefaultId();
            if(!defaultCalendarId)
            return aCandidate.openSelectDefaultCalendarModal();
            var obj = {
                "type": inviteId,
                "calendarId": store.getCalendarId()
            }
            $(".candidateDetailsModal[data-application-id="+applicationId+"]").find('.invite').attr('state','clicked')
            $(".candidateDetailsModal[data-application-id="+applicationId+"]").find('.inviteTelephonic .loadingScroller').removeClass('hidden');
            sendInterViewInvite(recruiterId, jobId, applicationId , obj)
        }
        // sendInterViewInvite(recruiterId, jobId, applicationId , obj)
    })

    function onSendInterViewInviteSuccess(topic, data){
        var applicationId=data['parameters']['applicationId'];
        aCandidate.changeInviteText(data.parameters.applicationId)
        if(data.parameters.inviteId == 1){
            toastNotify(1, "Face to Face Invite Sent Successfully!")
            $(".candidateDetailsModal[data-application-id="+applicationId+"]").find('.inviteF2f .icon-container').removeClass('hidden');
            $(".candidateDetailsModal[data-application-id="+applicationId+"]").find('.inviteF2f .loadingScroller').addClass('hidden');
        }
        if(data.parameters.inviteId == 2){
            toastNotify(1, "Telephonic Invite Sent Successfully!")
            $(".candidateDetailsModal[data-application-id="+applicationId+"]").find('.inviteTelephonic  .icon-container').removeClass('hidden');
            $(".candidateDetailsModal[data-application-id="+applicationId+"]").find('.inviteTelephonic .loadingScroller').addClass('hidden');
        }
    }

    function onSendInterViewInviteFail(topic, data) {

        if(data.status == 400 && data.responseJSON && data.responseJSON.code == 4001) {
            return window.location.href = "/calendar/"+data.parameters.calendarId+"/edit?insuffSlotsErrMsg=1";
        }
        var applicationId=data['parameters']['applicationId'];
        $(".candidateDetailsModal[data-application-id="+applicationId+"]").find('.invite .loadingScroller').addClass('hidden');
        $(".candidateDetailsModal[data-application-id="+applicationId+"]").find('.inviteF2f').attr('state','default');
        $(".candidateDetailsModal[data-application-id="+applicationId+"]").find('.inviteTelephonic').attr('state','default');
        errorHandler(data)
    }

    aCandidate.onChangeDefaultCalendar(function(calendarId) {
        var defaultCalendarId = store.getDefaultId();
        var obj = {}
        if(defaultCalendarId) {
            obj = {
                defaultId: defaultCalendarId
            }
        }
        $('.calendarSelect').prop('disabled', true);
        setDefaultCalendar( recruiterId, jobId, calendarId, obj, {})
    })

    aCandidate.onClickDownloadResume(function(applicationId, status){
        // debugger
        var eventObj = {
           event_category: eventMap["downloadResume"]["cat"],
           event_label: 'origin=Profile,type=Single,recId='+recruiterId+''
        }
        if(successRef=="Email"){
            eventObj.event_label='origin=Email,type=Single,recId='+recruiterId+''
         }
        sendEvent(eventMap["downloadResume"]["event"], eventObj)
        setCandidateAction(recruiterId, jobId, "download" , applicationId, {});
    });

    function onSuccessfullSetDefaultCalendar(topic, res) {
        $('.calendarSelect').prop("disabled",false);
        store.setId(res.data, parseInt(res.calendarId))
        aCandidate.closeModal()
        toastNotify(1, "Default Calendar Set.")
    }

    function onFailSetDefaultCalendar(topic, res) {
        $('.calendarSelect').prop("disabled",false);
        $('.calendarSelect').val(-1)
        errorHandler(res);
    }

    var fetchJobApplicationsSuccessSubscription = pubsub.subscribe("fetchCandidateProfile", onCandidateProfileFetchSuccess)
    var fetchJobApplicationsFailSubscription = pubsub.subscribe("fetchCandidateProfileFail", onCandidateProfileFetchFail)
    var setCandidateActionSuccessSubscription = pubsub.subscribe("setCandidateActionSuccess", onSuccessfullCandidateAction)
    var setCandidateActionFailSubscription = pubsub.subscribe("setCandidateActionFail", onFailCandidateAction)
    var fetchedTagsSuccessSubscription = pubsub.subscribe("fetchedTags", onSuccessfullFetchedTag)
    var fetchTagsFailSubscription = pubsub.subscribe("fetchTagsFail", onFailFetchedTag)
    var fetchedCalendarsSuccessSubscription = pubsub.subscribe("fetchedCalendars", onSuccessfullFetchedCalendars)
    var fetchCalendarsFailSubscription = pubsub.subscribe("failedToFetchCalendars", onFailFetchedCalendars)

    var sendInterViewInviteSuccessSubscription = pubsub.subscribe("sendInterViewInviteSuccess", onSendInterViewInviteSuccess)
	var sendInterViewInviteFailSubscription = pubsub.subscribe("sendInterViewInviteFail", onSendInterViewInviteFail);

    var setDefaultCalendarSuccessSubscription = pubsub.subscribe("setDefaultCalendarSuccess", onSuccessfullSetDefaultCalendar)
    var setDefaultCalendarFailSubscription = pubsub.subscribe("setDefaultCalendarFail", onFailSetDefaultCalendar)

})

function errorHandler(data) {
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
    if(!res) {
        return toastNotify(3, "Looks like you are not connected to the internet");
    }
    return toastNotify(3, res.message);
}
