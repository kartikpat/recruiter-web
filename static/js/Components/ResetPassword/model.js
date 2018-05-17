var errorResponses = {
	missingEmail: 'Please enter the Email address',
	invalidEmail: 'That looks like an invalid email address',
	missingPassword: 'Please enter your password',
	invalidPassword: 'Please enter a valid password',
	userFail: 'Email address does not exist',
	passwordFail: 'Incorrect password',
	missingParameters: 'Oops! Our engineers will fix this shortly. Please try again after sometime.',
	serviceError: 'Oops! Our engineers are working on fixing this, please try again after sometime.',
	noInternet: 'Looks like you are not connected to the internet',
	passwordMatch:"The new password and confirm password do not match"
}
var emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
function resetPassword(){
	var user= {}
	function init(){
		user.email=$('.userEmail');
		user.password = $("#password");
		user.confirmPassword=$("#passwordConfirm");
		user.login = $("#login");
		user.errors = $('.error');
        user.key = $("#key");
        user.resetSuccess = $("#resetSuccess")
	}
	function loginHandler(fn){
		user.login.click(fn);
	}
	function getData(){
		return {
            key: user.key.val(),
			email: user.email.text(),
			password: user.password.val()
		}
	}
	function checkPasswordMatch(one, two){
		if(!((one.val()).trim() && (two.val()).trim())) {
			return true
		}
		if(ifBothMatches(one.val(), two.val())){
			return false
		}
		$('.confirmError').text(errorResponses["passwordMatch"]);
		return true
	}

	function eraseErrors(){
		user.errors.text('');
	}

	function errorHandler(res){
		var message = '';
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
			default:
				message = errorResponses.noInternet
				break;
		}
		user.password.next('.error').text(message)
		return
	}

	function validateLogin(){
		eraseErrors();
		// if(!( user.email && user.email.val() )){
		// 	console.log(user.email.next('.error'))
		// 	user.email.next('.error').text(errorResponses['missingEmail'])
		// 	return false
		// }

		// if(!emailRegex.test(user.email.val())){
		// 	user.email.next('.error').text(errorResponses['invalidEmail'])
		// 	return false
		// }
		if(!( user.password && user.password.val() )){
			user.password.next('.error').text(errorResponses['missingPassword']);
			return false;
		}
		if((checkPasswordMatch(user.password,user.confirmPassword))){
			return false
		}
		return true;
	}
	function test(fn){
		fn(user);
	}
    function successMsg() {
    	user.email.addClass('hidden');
		user.password.addClass('hidden');
		user.confirmPassword.addClass('hidden')
    	user.login.addClass('hidden');
        user.resetSuccess.html("Password Successfully Reset. You can <a class='link-color' href='login'> Login</a> with new password.")
    }
	return {
		init: init,
		getData: getData,
		validateLogin: validateLogin,
		loginHandler: loginHandler,
		errorHandler: errorHandler,
		test: test,
		successMsg: successMsg,
		checkPasswordMatch:checkPasswordMatch
	}

}
