var errorResponses = {
	missingEmail: 'Please enter your Email address',
	invalidEmail: 'Please enter a valid Email address',
	missingPassword: 'Please enter your password',
	invalidPassword: 'Please enter a valid password',
	userFail: 'Email address does not exist',
	passwordFail: 'Incorrect password',
	serviceError: 'Oops! Our engineers are working on fixing this, please try again after sometime.'	
}
function userCredentials(){
	var user= {}
	function init(){
		user.email = $("#email");
		user.password = $("#password");
		user.login = $("#login")

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
	function validateLogin(){
		if(Object.keys(user).length ===0){
			console.log('empty user')
			return false
		}

		if(!( user.email && user.email.val() )){
			user.email.find('.error').text(errorResponses['missingEmail'])
			return false
		}
		if(isValidEmail(creds.email)){
			user.email.find('.error').text(errorResponses['invalidEmail'])
			return false
		}
		if(!( user.password && user.password.val() )){
			user.password.find('.error').text(errorResponses['missingPassword']);
			return false;
		}
		return true;
	}
	return {
		init: init,
		getData: getData,
		validateLogin: validateLogin,
		loginHandler: loginHandler
	}

}

function isValidEmail(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
};