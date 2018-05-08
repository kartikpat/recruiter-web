$(document).ready(function() {
	console.log(staticEndPoints)
	var userLogin = userCredentials();
	userLogin.init();
	userLogin.loginHandler(function(e){
		e.preventDefault()
		if(userLogin.validateLogin()){
			submitLogin(userLogin.getData());
		}
	})

	function onSuccessfulLogin(topic, data){
		localStorage.id = data["id"];
		window.location=staticEndPoints.dashboard;
	}
	function onFailedLogin(topic, data){
		userLogin.errorHandler(data);
	}
	var loginSuccessSubscription = pubsub.subscribe('successfulLogin', onSuccessfulLogin );
	var loginFailSubscription = pubsub.subscribe('failedLogin', onFailedLogin)


});
