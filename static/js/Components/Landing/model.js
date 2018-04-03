var errorResponsesLogin = {
	missingEmail: 'Please enter the Email address',
	invalidEmail: 'That looks like an invalid email address',
	missingPassword: 'Please enter your password',
	invalidPassword: 'Please enter a valid password',
	userFail: 'We could not find an account with that email address.',
	passwordFail: 'That password did not match. We can help you ',
	missingParameters: 'Oops! Our engineers will fix this shortly. Please try again after sometime.',
	serviceError: 'Oops! Our engineers are working on fixing this, please try again after sometime.'
}
 
var emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
function userCredentials(){
	var user= {}
	function init(){
		user.email = $("#email");
		user.password = $("#password");
		user.login = $("#login");
		user.errors = $('.error');
		user.loginForm = $("#loginForm");

		onChangeInputFields()
	}

	function onChangeInputFields() {
		user.loginForm.find('input').keyup(function(){
			eraseError($(this))
		})

	}
	function eraseError(element) {
		element.next('.error').text('')
	}
	function loginHandler(fn){
		user.login.click(fn);
	}
	function getData(){
		return {
			email: user.email.val(),
			password: user.password.val()
		}
	}
	function eraseErrors(){
		user.errors.text('');
	}

	function errorHandler(res){
		var message = '';
		console.log(res)
		switch(res.status){
			case 404:
				message = errorResponsesLogin.userFail;
				break;
			case 401:
				message = errorResponsesLogin.passwordFail;
				break;
			case 503:
				message = errorResponsesLogin.serviceError;
				break;
			case 422:
				message = errorResponsesLogin.missingParameters
				break;
		}
		if(res.status == 404) {
			return user.email.next('.error').html(message + "<span class='register-link'>Looking to register? <a href='' style='font-size:13px;' class='link-color trigger-register-registration-modal'>Register</a></span>")
		}
		if(res.status == 401) {
			return user.password.next('.error').html(message + "<span class='forgot-pass'><a href='/forgot-password' style='font-size:13px;' class='link-color forgot-recruiter-password'>recover it.</a></span>")
		}
		user.password.next('.error').text(message)
		return
	}

	function validateLogin(){
		eraseErrors();
		var flag = 1;
		if(!( user.email && user.email.val() )){
			user.email.next('.error').text(errorResponses['missingEmail'])
			flag = 0;
		}

		if(user.email && user.email.val() && !emailRegex.test(user.email.val())){
			user.email.next('.error').text(errorResponses['invalidEmail'])
			flag = 0;
		}
		if(!( user.password && user.password.val() )){
			user.password.next('.error').text(errorResponses['missingPassword']);
			flag = 0;
		}
		if(flag == 0) {
			return false;
		}
		return true;
	}
	function test(fn){
		fn(user);
	}
	return {
		init: init,
		getData: getData,
		validateLogin: validateLogin,
		loginHandler: loginHandler,
		errorHandler: errorHandler,
		test: test
	}

}
