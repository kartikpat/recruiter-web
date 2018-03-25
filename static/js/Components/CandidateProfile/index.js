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

    //initializing the models
    aCandidate.init();
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

     aCandidate.onClickShortlistCandidate(function(applicationId, newStatus, dataAction) {
         var action;
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

    function onCandidateProfileFetchSuccess(topic, res) {

        aCandidate.populateCandidateData(res.data[0])
    }

   function onCandidateProfileFetchFail(topic, data){
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
        var arr = [];
        arr.push(res.applicationId)
        if(res.action == "unread") {
            var newStatus = 0
            if(res.parameters.isModalButton) {

                aCandidate.changeButtonText(arr, newStatus, res.parameters.dataAction)
                return toastNotify(1, "Moved to Unread Tab")
            }
        }
        if(res.action == "shortlist") {
            var newStatus = 1
            if(res.parameters.isModalButton) {

                aCandidate.changeButtonText(arr, newStatus, res.parameters.dataAction)
                return toastNotify(1, "Moved to Shortlisted Tab")
            }
        }
        if(res.action == "reject") {
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
    }

    function onSuccessfullFetchedTag(topic, res) {
        aCandidate.showDropdownTags(res["data"]);
    }

    function onFailFetchedTag(topic, res) {
        errorHandler(res);
    }

    var fetchJobApplicationsSuccessSubscription = pubsub.subscribe("fetchCandidateProfile", onCandidateProfileFetchSuccess)
    var fetchJobApplicationsFailSubscription = pubsub.subscribe("fetchCandidateProfileFail", onCandidateProfileFetchFail)
    var setCandidateActionSuccessSubscription = pubsub.subscribe("setCandidateActionSuccess", onSuccessfullCandidateAction)
    var setCandidateActionFailSubscription = pubsub.subscribe("setCandidateActionFail", onFailCandidateAction)
    var fetchedTagsSuccessSubscription = pubsub.subscribe("fetchedTags", onSuccessfullFetchedTag)
    var fetchTagsFailSubscription = pubsub.subscribe("fetchTagsFail", onFailFetchedTag)

})

function errorHandler(data) {
    var res = data.responseJSON
    if(!res) {
        return toastNotify(3, "Something went wrong");
    }
    return toastNotify(3, res.message);
}
