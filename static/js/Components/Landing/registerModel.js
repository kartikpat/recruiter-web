var errorResponses = {
	missingName: 'Please enter your name',
	missingEmail: 'Please enter the Email address',
	invalidEmail: 'That looks like an invalid email address',
	missingPhone: 'Please enter your phone',
	invalidPhone: 'Invalid phone number',
	missingDesignation: 'Please enter your designation',
	missingOrganization: 'Please enter your organisation',
	missingPassword: 'Please enter your password',
	missingConfirmPassword:'Please re-type your password',
	passwordMismatch: 'Both passwords do not match',
	invalidPassword: 'Please enter a valid password',
	userFail: 'Email address does not exist',
	passwordFail: 'Incorrect password',
	missingParameters: 'Oops! Our engineers will fix this shortly. Please try again after sometime.',
	serviceError: 'Oops! Our engineers are working on fixing this, please try again after sometime.',
	duplicate: 'There is already an account registered with this email id'
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
function checkPassword(one, two){
	if(!ifBothMatches(one.val(), two.val())){
		two.next('.error').text(errorResponses['passwordMismatch'])
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
