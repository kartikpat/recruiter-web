$(document).ready(function() {
	var userLogin = userCredentials();
	// user.login = $("#login");
	userLogin.init();
	userLogin.loginHandler(function(e){
		e.preventDefault()
		console.log('click noted')
		$('#login').prop('disabled',true);
		document.getElementById("login").innerHTML='<span class= "inline-spinner"></span>';
		if(userLogin.validateLogin()){
			submitLogin(userLogin.getData());
		}
	})

	function onSuccessfulLogin(topic, data){
		console.log('Login successful');
		localStorage.id = data["id"];
		window.location="/";
		document.getElementById("login").disabled=false;
	}
	
	function onFailedLogin(topic, data){
		console.log('Login failed');
		userLogin.errorHandler(data);
		document.getElementById("login").disabled=false;
		document.getElementById("login").innerHTML="";
	}

	var loginSuccessSubscription = pubsub.subscribe('successfulLogin', onSuccessfulLogin );
	var loginFailSubscription = pubsub.subscribe('failedLogin', onFailedLogin)

	var userRegister = registerUser();
	userRegister.init();
	userRegister.registerHandler(function(e){
		console.log('Register clicked')
		if(userRegister.validateRegister()){
			document.getElementById("register").disabled=true;
			submitRegister(userRegister.getData());
		}
	});

	function onSuccessfulRegister(topic, data){
		console.log('successful reister');
		document.getElementById("register").innerHTML = '<span class= "inline-spinner"></span>';
		window.location = "/welcome";
		document.getElementById("register").disabled=false;
	}
	function onFailedRegister(topic, data){
		console.log('register failed');
		userRegister.errorHandler(data);
		document.getElementById("register").disabled=false;
	}
	var registerSuccessSubscription = pubsub.subscribe('successfulRegister', onSuccessfulRegister );
	var registerFailSubscription = pubsub.subscribe('failedRegister', onFailedRegister);
	// userRegister.test(function completeRegisterFormSuccess(user){
	// 	user.name.val('Saurabh')
	// 	user.email.val('shreya@iimjobs.com');
	// 	user.phone.val('8860268468');
	// 	user.designation.val('Software engineer')
	// 	user.organization.val('iimjobs');
	// 	user.confirmPassword.val(123);
	// 	user.password.val(123456)
	// })
});
