// var errorResponses = {
// 	missingEmail: 'Please enter the Email address',
// 	invalidEmail: 'That looks like an invalid email address',
// 	missingPassword: 'Please enter your password',
// 	invalidPassword: 'Please enter a valid password',
// 	userFail: 'Email address does not exist',
// 	passwordFail: 'Incorrect password',
// 	missingParameters: 'Oops! Our engineers will fix this shortly. Please try again after sometime.',
// 	serviceError: 'Oops! Our engineers are working on fixing this, please try again after sometime.'
// }

var emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
function userCredentials(){
	var user= {} 
	function init(){
		user.email = $("#email");
		user.password = $("#password");
		user.login = $("#login");
		user.errors = $('.error');

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
				message = errorResponses.userFail;
				break;
			case 401:
				message = errorResponses.passwordFail;
				break;
			case 503:
				message = errorResponses.serviceError;
				break;
			case 422:
				message = errorResponses.missingParameters
				break;
		}
		user.password.next('.error').text(message)
		return
	}
	
	function validateLogin(){
		eraseErrors();

		if(!( user.email && user.email.val() )){
			console.log(user.email.next('.error'))
			user.email.next('.error').text(errorResponses['missingEmail'])
			return false
		}

		if(!emailRegex.test(user.email.val())){
			user.email.next('.error').text(errorResponses['invalidEmail'])
			return false
		}
		if(!( user.password && user.password.val() )){
			user.password.next('.error').text(errorResponses['missingPassword']);
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
