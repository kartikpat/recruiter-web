$(document).ready(function() {
	var userLogin = userCredentials().init();
	userLogin.loginHandler(function(){
		if(userLogin.validateLogin()){
			submitLogin(userLogin.getData());
		}
	})	
	


	var loginSuccessSubscription = pubsub.subscribe('successfulLogin', );
	var loginFailSubscription = pubsub.subscribe('failedLogin')
});
function onSuccessfulLogin(topic, data){

}
function onFailedLogin(topic, data){

}