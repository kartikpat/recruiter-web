$(document).ready(function() {
	var userLogin = userCredentials();
	userLogin.init();
	userLogin.onEnter();
	userLogin.loginHandler(function(e){
		e.preventDefault()
		console.log('click noted')
		spinner();
		if(userLogin.validateLogin()){
			$('#login').prop('disabled',true);
			submitLogin(userLogin.getData());
	    }
	})

	function onSuccessfulLogin(topic, data){
		spinner();
		localStorage.id = data["id"];
		window.location="/";
		document.getElementById("login").disabled=false;
	}

	function onFailedLogin(topic, data){
		togglespinner();
		userLogin.errorHandler(data);
		document.getElementById("login").disabled=false;
	}

	var loginSuccessSubscription = pubsub.subscribe('successfulLogin', onSuccessfulLogin );
	var loginFailSubscription = pubsub.subscribe('failedLogin', onFailedLogin)

	var userRegister = registerUser();
	userRegister.init();
	userRegister.registerHandler(function(e){

		if(userRegister.validateRegister()){
			document.getElementById("register").disabled=true;
			submitRegister(userRegister.getData());
		}
	});

	function onSuccessfulRegister(topic, data){
		$('.spinner').removeClass('hidden');
		$('#register').addClass('hidden');
		document.getElementById("register").innerHTML = '<span class= "inline-spinner"></span>';
		window.location = "/verify-email";
		document.getElementById("register").disabled=false;
	}
	function onFailedRegister(topic, data){
		$('.spinner').addClass('hidden');
		$('#register').removeClass('hidden');
		userRegister.errorHandler(data);
		document.getElementById("register").disabled=false;
	}



	var registerSuccessSubscription = pubsub.subscribe('successfulRegister', onSuccessfulRegister );
	var registerFailSubscription = pubsub.subscribe('failedRegister', onFailedRegister);

	userRegister.test(function completeRegisterFormSuccess(user){
		user.name.val('Saurabh')
		user.email.val('shreya@iimjobs.com');
		user.phone.val('8860268468');
		user.designation.val('Software engineer')
		user.organization.val('iimjobs');
		user.confirmPassword.val(123456);
		user.password.val(123456)
	})

	function spinner(){
		$('#login').addClass("hidden");
		$('.spinner').removeClass("hidden");
	}
	
	function togglespinner(){
		$('#login').removeClass("hidden");
		$('.spinner').addClass("hidden");
	}

	// userRegister.test(function completeRegisterFormSuccess(user){
	// 	user.name.val('Saurabh')
	// 	user.email.val('shreya@iimjobs.com');
	// 	user.phone.val('8860268468');
	// 	user.designation.val('Software engineer')
	// 	user.organization.val('iimjobs');
	// 	user.confirmPassword.val(123456);
	// 	user.password.val(123456)
	// })

});
