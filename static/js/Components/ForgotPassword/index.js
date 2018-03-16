$(document).ready(function() {
	var userForgotPswrd = userForgotPassword();
	userForgotPswrd.init();
	userForgotPswrd.submitHandler(function(e){
		e.preventDefault()
		if(userForgotPswrd.validate()){
			submitForgotPassword(userForgotPswrd.getData());
		}
	})

	function onSuccessfulForgotPassword(topic, data) {
		userForgotPswrd.successMsg()
	}

	function onFailedForgotPassword(topic, data){
		userForgotPswrd.errorHandler(data);
	}
	var loginSuccessSubscription = pubsub.subscribe('successfulForgotPassword', onSuccessfulForgotPassword );
	var loginFailSubscription = pubsub.subscribe('failedForgotPassword', onFailedForgotPassword)

})
