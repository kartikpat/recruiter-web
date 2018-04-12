$(document).ready(function() {
	var userResend = userResend();
	userResend.init();
	userResend.submitHandler(function(e) {
		e.preventDefault()
        var data = {
            email: email
        }
		resendActivationLink(recruiterId,data);
	})

	function onSuccessfulResendInvite(topic, data) {
		userResend.changeText()
	}

	function onFailedResendInvite(topic, data){
		errorHandler(data);
	}
	var loginSuccessSubscription = pubsub.subscribe('resendInviteSuccess', onSuccessfulResendInvite );
	var loginFailSubscription = pubsub.subscribe('resendInviteFail', onFailedResendInvite)

})
