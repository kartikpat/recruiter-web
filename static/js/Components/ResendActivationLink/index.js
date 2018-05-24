$(document).ready(function() {
	var userResnd = userResend();
	userResnd.init();
	userResnd.submitHandler(function(e) {
		e.preventDefault()
		resendActivationLink(token);
	})

	function onSuccessfulResendInvite(topic, data) {
		// debugger
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
        return toastNotify(3, "Looks like you are not connected to the internet");
    }
	if(data.status == 503) {
        toastNotify(3, "Oops...something went wrong. Our engineers are fixing the issue");
         return
    }
    return toastNotify(3, res.message);
}
