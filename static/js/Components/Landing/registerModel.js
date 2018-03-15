var errorResponses = {
	missingName: 'Please enter your name',
	missingEmail: 'Please enter email id',
	invalidEmail: 'Please enter a valid email id',
	missingPhone: 'Please enter phone number',
	invalidPhone: 'Invalid phone number',
	missingDesignation: 'Please enter the designation',
	missingOrganization: 'Please enter the organisation',
	missingPassword: 'Please enter a password',
	missingConfirmPassword:'Please confirm your password',
	passwordMismatch: 'The passwords you entered do not match',
	invalidPassword: 'Please enter a valid password',
	userFail: 'Email address does not exist',
	passwordFail: 'Incorrect password',
	missingParameters: 'Oops! Our engineers will fix this shortly. Please try again after sometime.',
	serviceError: 'Oops! Our engineers are working on fixing this, please try again after sometime.',
	duplicate: 'This email is already registered. Please login.',
	minLengthPassword: 'Password should be at least 6 characters'
}
function registerUser(){
	var user= {}
	function init(){
		user.name = $("#registerName");
		user.email = $("#registerWorkEmail");
		user.phone = $("#registerPhone");
		user.designation = $("#registerDesignation");
		user.organization = $("#registerOrganization");
		user.password = $("#registerPassword");
		user.confirmPassword = $("#registerConfirmPassword")
		user.register = $("#register");
		user.errors = $('.error');
	}
	function registerHandler(fn){
		user.register.click(fn);
	}
	function getData(){
		return {
			name: user.name.val(),
			email: user.email.val(),
			phone: user.phone.val(),
			designation: user.designation.val(),
			organisation: user.organization.val(),
			password: user.password.val(),
			confirmPassword: user.confirmPassword.val(),
			type: 1
		}
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
			case 409:
				message = errorResponses.duplicate
		}
		user.confirmPassword.next('.error').text(message)
		return
	}

	function validateRegister(){
		eraseErrors();
		if(!(
				ifExists(user.name)
				&&	ifExists(user.email)
				&&	checkEmail(user.email)
			    &&	ifExists(user.phone)
				&&	checkPhone(user.phone)
				&&	ifExists(user.designation)
				&&	ifExists(user.organization)
				&&	ifExists(user.password)
				&&	ifExists(user.confirmPassword)
				&&  checkMinCharacters(user.password, 6)
				&&	checkPassword(user.password , user.confirmPassword)

		)){
			console.log('false')
			return false
		}
		console.log('true')
		return true;
	}
	function test(fn){
		fn(user);
	}
	return {
		init: init,
		getData: getData,
		validateRegister: validateRegister,
		registerHandler: registerHandler,
		errorHandler: errorHandler,
		test: test
	}
}

function checkMinCharacters(ele, len) {
	if(!checkCharacters(ele.val().length, len)) {
		ele.next('.error').text(errorResponses['minLength'+ele.attr('name')])
		
		return false
	}
	return true
}

function checkPassword(one, two){
	if(!ifBothMatches(one.val(), two.val())){
		two.next('.error').text(errorResponses['passwordMismatch'])
		return false
	}
	return true
}
function checkEmail(element){
	if(!( element && element.val() && isValidEmail(element.val()) )){
		element.next('.error').text(errorResponses['invalidEmail']);
		return false;
	}
	return true
}
function checkPhone(element){
	if(!( element && element.val() && isValidPhone(element.val()) )){
		element.next('.error').text(errorResponses['invalidPhone']);
		return false;
	}
	return true
}

function ifExists(element){
	console.log(element)
	if(!( element && element.val() )){
		element.next('.error').text(errorResponses['missing'+element.attr('name')]);
		return false;
	}
	return true;
}
