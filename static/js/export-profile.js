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


$(".main-container").on('click',".connect-box-bottom .linkedin-connect", function(event) {
    event.preventDefault();
    hello('linkedin').login().then(function(auth){
        console.log(auth)
        hello(auth.network).api('me').then(function(json) {
            console.log(json)

        }, function(e) {
            alert('Whoops! ' + e.error.message);
        });
    }, function(e) {
        alert('Whoops! ' + e.error.message);
    });
});

hello.init({
    linkedin: '81yy7zniicncli'
}, {redirect_uri: '/recruiter/export-profile?status=1'});

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
