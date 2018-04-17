var isSuccess;

$(document).ready(function(){
    $("#basic-buy").click(basicPosting);

    $(".button.signature-continue").click(signaturePosting);
    $(".button.platinum-continue").click(platinumPosting);
	$(".close-modal, .close").click(closeModal);

    // isSuccess = getUrlParameter('success');
    //
    // if(isSuccess == 1) {
    //     $("#success-job-posted").removeClass("hidden");
    // }

    var successMsg = getQueryParameter("jobPostMessage");
    if(!isEmpty(successMsg)) {
        toastNotify(1, decodeURIComponent(successMsg))
        var newUrl = removeParam("jobPostMessage", window.location.href)
        window.history.replaceState("object or string", "Title", newUrl);
    }

    window.mySwipe = $('.mobile-swipe-container').Swipe().data('Swipe');
});

var basicPosting = function() {
    window.location = "/my-jobs";
}

var signaturePosting = function() {
    window.location = "/";
}

var platinumPosting = function() {
    window.location = "/";
}

var closeModal = function() {
    $(".modal").addClass('hidden');
}



var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
