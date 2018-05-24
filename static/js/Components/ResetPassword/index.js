$(document).ready(function() {
	var resetPsword = resetPassword();
	resetPsword.init();
	resetPsword.loginHandler(function(e){
		e.preventDefault()
		if(resetPsword.validateLogin()){
            var data = resetPsword.getData()
			submitResetPassword(data);
		}
	})

	function onSuccessfulReset(topic, data){
		resetPsword.successMsg()

	}
	function onFailedReset(topic, data){
		resetPsword.errorHandler(data);
	}

	var resetSuccessSubscription = pubsub.subscribe('successfulResetPassword', onSuccessfulReset );
	var resetFailSubscription = pubsub.subscribe('failedResetPassword', onFailedReset)
});
