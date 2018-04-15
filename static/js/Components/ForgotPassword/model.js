var errorResponses = {
	missingEmail: 'Please enter the Email address',
	invalidEmail: 'That looks like an invalid email address',
	userFail: 'Email address does not exist',
	missingParameters: 'Oops! Our engineers will fix this shortly. Please try again after sometime.',
	serviceError: 'Oops! Our engineers are working on fixing this, please try again after sometime.',
	noInternet: 'You are offline'
}

var emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
function userForgotPassword(){
	var user= {}
	function init() {
		user.email = $("#email");
        user.login = $("#login");
        user.errors = $('.error');
        user.recoverySuccess = $("#recoverySuccess")
	}

	function submitHandler(fn){
		user.login.click(fn);
	}

	function getData(){
		return {
			email: user.email.val()
		}
	}
	function eraseErrors(){
		user.errors.text('');
		user.recoverySuccess.text('')
	}

	function errorHandler(res){
		var message = '';
		console.log(res)
		switch(res.status){
			case 404:
				message = errorResponses.userFail;
				break;
			case 401:
				message = errorResponses.serviceError;
				break;
			case 503:
				message = errorResponses.serviceError;
				break;
			case 422:
				message = errorResponses.missingParameters
				break;
			default:
				message = errorResponses.noInternet
				break;
		}
		user.email.next(".error").text(message)
		return
	}

	function validate(){
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

		return true;
	}
	function test(fn){
		fn(user);
	}

	function successMsg() {
		user.email.addClass('hidden');
		user.login.addClass('hidden');
		user.errors.addClass('hidden');

		user.recoverySuccess.text("We have sent you a recovery email. Please check your mailbox.")
	}
	return {
		init: init,
		getData: getData,
		validate: validate,
		submitHandler: submitHandler,
		errorHandler: errorHandler,
		test: test,
		successMsg: successMsg
	}

}
