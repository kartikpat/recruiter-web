$(document).ready(function() {
	var userResnd = userResend();
	userResnd.init();
	userResnd.submitHandler(function(e) {
		e.preventDefault()
		resendActivationLink(token);
	})

	function onSuccessfulResendInvite(topic, data) {
		userResnd.changeText()
	}

	function onFailedResendInvite(topic, data){
		errorHandler(data);
	}
	var loginSuccessSubscription = pubsub.subscribe('resendInviteSuccess', onSuccessfulResendInvite );
	var loginFailSubscription = pubsub.subscribe('resendInviteFail', onFailedResendInvite)

})

function errorHandler(data) {
    var res = data.responseJSON
    if(!res) {
        return toastNotify(3, "Something went wrong");
    }
    return toastNotify(3, res.message);
}
