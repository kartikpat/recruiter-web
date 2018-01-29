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

	var userRegister = registerUser();
	userRegister.init();
	userRegister.registerHandler(function(e){
		console.log('Register clicked')
		if(userRegister.validateRegister()){
			submitRegister(userRegister.getData());
		}
	});

	function onSuccessfulRegister(topic, data){
		console.log('successful reister');
		window.location = "/account-created";
	}
	function onFailedRegister(topic, data){
		console.log('register failed');
		userRegister.errorHandler(data);
	}
	var registerSuccessSubscription = pubsub.subscribe('successfulRegister', onSuccessfulRegister );
	var registerFailSubscription = pubsub.subscribe('failedRegister', onFailedRegister);
	userRegister.test(function completeRegisterFormSuccess(user){
	user.name.val('Saurabh')
	user.email.val('shreya@iimjobs.com');
	user.phone.val('8860268468');
	user.designation.val('Software engineer')
	user.organization.val('iimjobs');
	user.confirmPassword.val(123);
	user.password.val(123456)
})
});