$(document).ready(function() {
	var resetPsword = resetPassword();
	resetPsword.init();
	resetPsword.loginHandler(function(e){
		e.preventDefault()
		console.log('click noted')
		if(resetPsword.validateLogin()){
            
            return console.log(resetPsword.getData())
		//	submitLogin(userLogin.getData());
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
