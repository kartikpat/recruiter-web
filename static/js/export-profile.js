$(document).ready(function(){

    var status = getUrlParameter("status");

    if(status && status == 1) {
        $(".connect-boxes-container").addClass("hidden");
        $(".connect-box-bottom").addClass("hidden");
        $(".confirmation-mssg").removeClass("hidden");

    }

    else {
        $(".connect-boxes-container").removeClass("hidden");
        $(".connect-box-bottom").removeClass("hidden");
    }

	$(".skip").click(function(event){
        event.preventDefault();
        window.location = "/recruiter/export-profile?status=1";
    });

    windowH();
});

function windowH() {
	var wH = $(window).height();
	$('.main-container').css({height: wH-'50'});
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
