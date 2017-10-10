$(document).ready(function(){

    var passKey = getUrlParameter("k");

    if(passKey) {
        $(".main-container .account-activation-message").html("<div>Your Account Activated Successfully ! </div><div><a class='log-in link-color' href='/'>Log In</a></div>  ")
        postRequest(baseUrl+"/activate?k="+passKey,  null, {}, successCallback )
    }

    windowH();

});

var successCallback = function(res) {
    console.log(res);
}

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
