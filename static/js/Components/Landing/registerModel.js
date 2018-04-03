var errorResponses = {
	missingName: 'Please enter your name',
	missingEmail: 'Please enter email id',
	invalidEmail: 'Please enter a valid email id',
	missingPhone: 'Please enter phone number',
	invalidPhone: 'Please add a valid 10 digit number.',
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
	minLengthPassword: 'Password should be at least 6 characters',
	missingRecruiterType: 'Please Select Recruiter Type'
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
		user.confirmPassword = $("#registerConfirmPassword");
		user.register = $("#register");
		user.errors = $('.error');
		user.recruiterType = $('#rectype');
		user.registerForm = $("#registerForm");

		onChangeInputFields();
	}
	function onChangeInputFields() {
		user.registerForm.find('input').keyup(function(){
			eraseError($(this))
		})
		user.registerForm.find('select').change(function(){
			eraseError($(this))
		})
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
			type: user.recruiterType.val()
		}
	} 

	function eraseError(element) {
		element.next('.error').text('')
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
		if(res.status == 409) {
			return user.email.next('.error').text(message)
		}
		user.recruiterType.next('.error').text(message)
		return
	}

	function validateRegister(){
		var flag = 1;
		eraseErrors();
		if(!ifExists(user.name)){
			flag = 0;
		}
		if(!ifExists(user.email)){
			flag = 0;
		}
		if(!checkEmail(user.email)){
			flag = 0;
		}
		if(!ifExists(user.phone)){
			flag = 0;
		}
		if(!checkPhone(user.phone)){
			flag = 0;
		}
		if(!ifExists(user.designation)){
			flag = 0;
		}
		if(!ifExists(user.organization)){
			flag = 0;
		}
		if(!ifExists(user.password)){
			flag = 0;
		}
		if(!ifExists(user.confirmPassword)){
			flag = 0;
		}
		if(!checkMinCharacters(user.password, 6)){
			flag = 0;
		}
		if(!checkPassword(user.password , user.confirmPassword)){
			flag = 0;
		}
		if(!ifExists(user.recruiterType)){
			flag = 0;
		}
		if(flag == 0) {
			return false
		}
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
	if(!ele.val()) {
		return true
	}
	if(!checkCharacters(ele.val().length, len)) {
		ele.next('.error').text(errorResponses['minLength'+ele.attr('name')])
		return false
	}
	return true
}

function checkPassword(one, two){
	if(!(one.val() && two.val())) {
		return true
	}
	if(!ifBothMatches(one.val(), two.val())){
		two.next('.error').text(errorResponses['passwordMismatch'])
		return false
	}
	return true
}
function checkEmail(element){
	if(!element.val()) {
		return true
	}
	if(!( element && element.val() && isValidEmail(element.val()) )){
		element.next('.error').text(errorResponses['invalidEmail']);
		return false;
	}
	return true
}
function checkPhone(element){
	if(!element.val()) {
		return true
	}
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
