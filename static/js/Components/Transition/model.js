$(document).ready(function(){

    setInterval(function() {
    	if($("#login").css('display')=='none'){
			$("#wait").addClass("fadeOut");
			$("#login").removeClass('fadeOut')
        	$('#wait').addClass('hidden');
        	$("#login").removeClass('hidden')
        	return
    	}
        $("#login").addClass("fadeOut");
        $("#wait").removeClass('fadeOut')
        $('#login').addClass('hidden');
        $("#wait").removeClass('hidden')
      },2000);

    function onSuccessVerifyLogin(topic, data){
    	window.location.href = "/";
    }

    function onFailVerifyLogin(topic, data){
    	window.location.href = "/login";
    }

    var verifyLoginSubscription = pubsub.subscribe("loginVerifySuccess", onSuccessVerifyLogin)
    var verifyLoginSubscription = pubsub.subscribe("loginVerifyFail", onFailVerifyLogin)


    verifyLogin(oldCookie);
   
});