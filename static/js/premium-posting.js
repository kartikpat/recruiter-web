var isSuccess;

$(document).ready(function(){
    $("#basic-buy").click(basicPosting);
    $("#signature-buy").click(openSignatureModal);
    $("#platinum-buy").click(openPlatinumModal);
    $(".button.signature-continue").click(signaturePosting);
    $(".button.platinum-continue").click(platinumPosting);
	$(".close-modal, .close").click(closeModal);

    // isSuccess = getUrlParameter('success');
    //
    // if(isSuccess == 1) {
    //     $("#success-job-posted").removeClass("hidden");
    // }

    var msg = localStorage.getItem("jobPostSuccessMessage")
	if(msg!= '') {
		toastNotify(1, msg)
		localStorage.removeItem("jobPostSuccessMessage");
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

var openSignatureModal = function() {
    addBodyFixed()
    $("#signature-modal").removeClass("hidden");

}

var openPlatinumModal = function() {
    addBodyFixed()
    $("#platinum-modal").removeClass("hidden");

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
