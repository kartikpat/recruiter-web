var globalParameters = {
    pageContent: 10,
    pageNumber: 1,
    candidateListLength: null
}

jQuery(document).ready( function() {
    var candidates = candidateList();
    candidates.init();

    var parameters = {}
    parameters.pageNumber = globalParameters.pageNumber;
    parameters.pageContent = globalParameters.pageContent;

    fetchFollowUps(recruiterId, parameters)

    candidates.onClickShortlistCandidate(function(applicationId, jobId) {
        setCandidateAction(recruiterId, jobId, "shortlist" , applicationId, {}, {});
    })

    function onSuccessfullCandidateAction(topic, res) {
        var arr = [];
        arr.push(res.applicationId)

        candidates.candidateActionTransition(arr)
        checkApplicationLength()

        if(res.action == "shortlist") {
            return toastNotify(1, "Candidate Successfully Shortlisted")
        }

        if(res.action == "rejected") {
            return toastNotify(1, "Candidate Successfully Rejected")
        }
    }

    function checkApplicationLength() {

        var length = candidates.getApplicationsLength()
        if(length <= 2) {
            var parameters = {}
            globalParameters.pageNumber = globalParameters.pageNumber + 1;
            parameters.pageNumber = globalParameters.pageNumber;
            parameters.pageContent = globalParameters.pageContent;
            showLoader()
            fetchFollowUps(recruiterId, parameters)
        }
    }

    candidates.onClickRejectCandidate(function(applicationId, jobId){
        setCandidateAction(recruiterId, jobId, "reject" , applicationId, {}, {});
    })

    function onFetchCandidatesSuccess(topic,res) {
        hideLoader()
        candidates.addToList(res,  globalParameters.pageNumber, globalParameters.pageContent)
    }

    function onFetchCandidatesFail(topic, res) {
        errorHandler(res)
    }

    function onFailCandidateAction(topic,res) {
        errorHandler(res);
    }

    var fetchCandidatesSuccessSubscription = pubsub.subscribe('fetchedFollowups', onFetchCandidatesSuccess)
    var fetchCandidatesFailSubscription = pubsub.subscribe('failedTofetchFollowups', onFetchCandidatesFail)

    var setCandidateActionSuccessSubscription = pubsub.subscribe("setCandidateActionSuccess", onSuccessfullCandidateAction)
    var setCandidateActionFailSubscription = pubsub.subscribe("setCandidateActionFail", onFailCandidateAction)

    var ticker;
    $(window).scroll(function() {
       clearTimeout(ticker);
       ticker = setTimeout(checkScrollEnd,100);
    });

    function checkScrollEnd() {
       if($(window).scrollTop() + $(window).height() > $(document).height() - 600) {
           globalParameters.pageNumber = globalParameters.pageNumber + 1;
           if(globalParameters.pageNumber != 1 && globalParameters.candidateListLength == globalParameters.pageContent) {

                var parameters = {}
                parameters.pageNumber = globalParameters.pageNumber;
                parameters.pageContent = globalParameters.pageContent;
                parameters.tagId = obj.tagId
                showLoader()
                fetchFollowUps(recruiterId,parameters)
           }
       }
    }

})

function errorHandler(data) {
    var res = data.responseJSON
    if(!res) {
        return toastNotify(3, "Something went wrong");
    }
    return toastNotify(3, res.message);
}
