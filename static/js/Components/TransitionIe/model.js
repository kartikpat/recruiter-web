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
         Set_Cookie(jobseekerCookieName, '',1, "/", baseDomainName);
    	window.location.href = staticEndPoints.dashboard;
    }

    function onFailVerifyLogin(topic, data){
        Set_Cookie(oldCookieName, '',1, "/", baseDomainName);
        window.location.href = staticEndPoints.landing;
        return
        if(data && data['responseJSON'] && data['responseJSON']['expiredToken']==3){
            Set_Cookie(jobseekerCookieName, '1',1, "/", baseDomainName);
        }
        else{
            Set_Cookie(oldCookieName, '',1, "/", baseDomainName);
        }
    	window.location.href = staticEndPoints.landing;
    }

    var verifyLoginSubscription = pubsub.subscribe("loginVerifySuccess", onSuccessVerifyLogin)
    var verifyLoginSubscription = pubsub.subscribe("loginVerifyFail", onFailVerifyLogin)
    
    verifyLogin(oldCookieValue);

});
