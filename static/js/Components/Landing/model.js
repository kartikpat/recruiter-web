var errorResponsesLogin = {
	missingEmail: 'Please enter the Email address',
	invalidEmail: 'That looks like an invalid email address',
	missingPassword: 'Please enter your password',
	invalidPassword: 'Please enter a valid password',
	userFail: 'We could not find an account with that email address.',
	passwordFail: 'That password did not match. We can help you ',
	missingParameters: 'Oops! Our engineers will fix this shortly. Please try again after sometime.',
	serviceError: 'Oops! Our engineers are working on fixing this, please try again after sometime.',
	noInternet: 'Looks like you are not connected to the internet'
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
		onEnter();
		onChangeInputFields()
	}

	function onChangeInputFields() {
		user.loginForm.find('input').keyup(function(event){
			if (event.keyCode === 13) {
				return
			}
			eraseError($(this))
		})
	}

	function eraseError(element) {
		element.next('.error').text('')
	}
	function loginHandler(fn){
		user.login.click(fn);
	}

	function onEnter(){
		user.loginForm.find('input').keypress(function(e){
			if (e.keyCode === 13) {
				user.login.click();
			}
		});
	}

	function getData(){
		return {
			email: user.email.val().trim(),
			password: user.password.val().trim()
			
		}
	}
	function eraseErrors(){
		user.errors.text('');
	}

	function errorHandler(res){
		var message = '';

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
			default:
				message = errorResponsesLogin.noInternet
				break;
		}
		if(res.status == 404) {
			return user.email.next('.error').html(message + "<span class='register-link'> <a href='' style='font-size:11px;' class='link-color trigger-register-registration-modal'>Looking to register?</a></span>")
		}
		if(res.status == 401) {
			return user.password.next('.error').html(message + "<span class='forgot-pass'><a href='/forgot-password' style='font-size:11px;' class='link-color forgot-recruiter-password'>recover it.</a></span>")
		}
		user.password.next('.error').text(message)
		return
	}

	function validateLogin(){
		eraseErrors();
		var flag = 1;
		if(!( user.email && user.email.val().trim() )){
			user.email.next('.error').text(errorResponses['missingEmail'])
			flag = 0;
		}

		if(user.email && user.email.val().trim() && !emailRegex.test(user.email.val().trim())){
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
