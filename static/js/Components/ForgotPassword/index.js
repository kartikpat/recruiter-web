$(document).ready(function() {
	var userForgotPswrd = userForgotPassword();
	userForgotPswrd.init();
	userForgotPswrd.submitHandler(function(e){
		e.preventDefault()
		if(userForgotPswrd.validate()){
			$('#login').addClass('hidden');
			$('.spinner').removeClass('hidden');
			submitForgotPassword(userForgotPswrd.getData());
		}
	})

	function onSuccessfulForgotPassword(topic, data) {
		$('.button-wrapper').addClass('hidden');
		userForgotPswrd.successMsg()
	}

	function onFailedForgotPassword(topic, data){
		$('#login').removeClass('hidden');
		$('.spinner').addClass('hidden');
		userForgotPswrd.errorHandler(data);
	}
	var loginSuccessSubscription = pubsub.subscribe('successfulForgotPassword', onSuccessfulForgotPassword );
	var loginFailSubscription = pubsub.subscribe('failedForgotPassword', onFailedForgotPassword)

})
