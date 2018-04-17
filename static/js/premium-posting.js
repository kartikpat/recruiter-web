var isSuccess;

$(document).ready(function(){


	$(".close-modal, .close").click(closeModal);

    // isSuccess = getUrlParameter('success');
    //
    // if(isSuccess == 1) {
    //     $("#success-job-posted").removeClass("hidden");
    // }
    window.mySwipe = $('.mobile-swipe-container').Swipe().data('Swipe');
});

var closeModal = function() {
    $(".modal").addClass('hidden');
}
