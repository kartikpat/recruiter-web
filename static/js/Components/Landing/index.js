$(document).ready(function() {
	var userLogin = userCredentials();
	userLogin.init();
	userLogin.loginHandler(function(e){
		e.preventDefault()
		console.log('click noted')
		if(userLogin.validateLogin()){
			submitLogin(userLogin.getData());
		}
	})	
	


	function onSuccessfulLogin(topic, data){
		console.log('Login successful');

		localStorage.id = data["id"];
		debugger
		window.location="/";

	}
	function onFailedLogin(topic, data){
		console.log('Login failed');
		userLogin.errorHandler(data);
	}
	var loginSuccessSubscription = pubsub.subscribe('successfulLogin', onSuccessfulLogin );
	var loginFailSubscription = pubsub.subscribe('failedLogin', onFailedLogin)
});