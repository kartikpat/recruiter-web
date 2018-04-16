var errorResponses = {
	missingName: 'Please enter your name',
	missingEmail: 'Please enter email id',
	invalidEmail: 'Please enter a valid email id',
	missingPhone: 'Please enter phone number',
	invalidPhone: 'Please add a valid 10 digit number.',
	missingDesignation: 'Please enter the designation',
	missingOrganization: 'Please enter the organisation',
	missingrecruiterType: 'Please select Recruiter Type',
	invalidWebsite: 'Enter proper Website Url',
	invalidFacebook: 'Enter proper Facebook Url',
	invalidTwitter: 'Enter proper Twitter Url',
	invalidLinkedIn: 'Enter proper LinkedIn Url',
	missingoldPassword: 'Please enter a password',
	missingnewPassword: 'Please enter a password',
	missingConfirmPassword:'Please confirm your password',
	passwordMismatch: 'The passwords you entered do not match'
}

var emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
var urlRegex = /^([a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+.*)$/;

function Profile(){
	var settings ={};
	var config = {};

	function setConfig(key, value) {
		config[key] = value;
	}
	function init(){
			settings.name= $('#profile-name'),
			settings.contact= $("#profile-number"),
			settings.email = $("#profile-email"),
			settings.designation= $("#profile-designation"),
			settings.organization= $("#profile-organization"),
			settings.websiteUrl= $("#profile-website"),
			settings.recruiterType= $("#recruiterType"),
			settings.location= $("#location"),
			settings.about= $("#profile-about"),
			settings.submitButton= $(".button.submit"),
			settings.twitter= $("#social-twitter"),
			settings.facebook= $("#social-facebook"),
			settings.linkedIn= $("#social-linkedin"),
			settings.oldPassword= $("#old-password"),
			settings.newPassword= $("#new-password"),
			settings.confirmPassword= $("#confirm-password"),
			settings.notification= $("#instant-notification"),
			settings.emailNotification= $("#digest-email-notification"),
			settings.uploadPic= $("#uploadPic")
			settings.profileImg = $('#profileImg'),
			settings.error = $('.error'),
			settings.creditsText = $('#creditsText'),
			settings.fileUpload = $("#trigger-file-upload"),
			settings.fileName = $("#fileName"),
			settings.seeAllPremium = $("#seeAllPremium"),
			settings.buyMore = $("#buyMore"),
			settings.premiumDetail = $("#premiumDetail")
			settings.type = ""
			settings.settingsBody = $(".settingsBody")
			changeFileName()
			onChangeInputFields()

			settings.editor = new MediumEditor("#profile-about", {
				toolbar: false,
				placeholder: {
			        text: 'About'
			    },
				disableExtraSpaces: true,
				hideOnClick: false
			})
	}

	function changeFileName() {
		settings.fileUpload.change(function() {
			if($(this).val()){
				settings.fileName.text(settings.fileUpload[0].files[0]["name"])
			}
			else {
				settings.fileName.text("No file chosen")
			}
		})
	}

	function onChangeInputFields() {
		settings.settingsBody.find('input').keyup(function(){
			eraseError($(this))
		})
	}

	function validate(){

		if(settings.type == "profile") {
			if(!(
					ifExists(settings.name)
					&& ifExists(settings.contact)
					&& checkPhone(settings.contact)
					&& ifExists(settings.designation)
					&& ifExists(settings.organization)
					&& ifExists(settings.recruiterType, true, true)
					&& checkEmail(settings.email)
					&& checkUrl(settings.websiteUrl)
				)){
				return false;
			}
			return true;
		}
		if(settings.type== "social-accounts") {

			if(!(
					checkUrl(settings.facebook)
					&& checkUrl(settings.linkedIn)
					&& checkUrl(settings.twitter)
				)){
				return false;
			}
			return true;
		}
		if(settings.type== "change-password") {
			if(!(
					ifExists(settings.oldPassword, true)
					&& ifExists(settings.newPassword, true)
					&& checkMinCharacters(settings.newPassword, 6)
					&& ifExists(settings.confirmPassword, true)
					&& checkPassword(settings.newPassword, settings.confirmPassword)
				)){
				return false;
			}
			return true;
		}
		if(settings.type== "notification-settings") {
			return true
		}

	}
	function getProfile() {

		var form = new FormData();

		if(settings.type == "profile") {
			if(settings.fileUpload[0].files[0] != undefined) {
  		    	form.append("image", settings.fileUpload[0].files[0], settings.fileUpload[0].files[0].name);
  		  	}
			if(settings.name.val()) {
				form.append("name", settings.name.val())
			}
			if(settings.organization.val()) {
				form.append("organisation", settings.organization.val())
			}
			if(settings.contact.val()) {
				form.append("phone", settings.contact.val())
			}
			if(settings.about.val()) {
				form.append("about", settings.about.val())
			}
			if(settings.email.val()) {
				form.append("email", settings.email.val())
			}
			if(settings.designation.val()) {
				form.append("designation", settings.designation.val())
			}
			if(settings.websiteUrl.val()) {
				form.append("websiteUrl", settings.websiteUrl.val())
			}
			if(settings.location.val()) {
				form.append("location", settings.location.val())
			}
			if(parseInt(settings.recruiterType.val())) {
				form.append("type", settings.recruiterType.val())
			}

		}
		if(settings.type== "social-accounts") {
			if(settings.facebook.val()) {
				form.append("facebookUrl", settings.facebook.val())
			}
			if(settings.linkedIn.val()) {
				form.append("lurl", settings.linkedIn.val())
			}
			if(settings.twitter.val()) {
				form.append("twitterUrl", settings.twitter.val())
			}

		}
		if(settings.type== "change-password") {
			var obj = {}
			if(settings.oldPassword.val()) {
				obj.password = settings.oldPassword.val()
			}
			if(settings.newPassword.val()) {
				obj.newPassword = settings.newPassword.val()
			}
			return obj;
		}
		if(settings.type== "notification-settings") {

			form.append("notificationEmail", $("input[name='notification-type']:checked").val())
		}

		return form;
	}

	function setProfile(obj) {
		settings.profileImg.attr("src", (obj["img_link"] || "/static/images/noimage.png"));
		settings.name.val(obj["name"]);
		settings.contact.val(obj["phone"]);
		settings.email.val(obj["email"]);
		settings.designation.val(obj["designation"]);

		if(obj["videoUrl"])
			settings.videoUrl.val(obj["videoUrl"]);

		settings.organization.val(obj["organisation"]);
		settings.websiteUrl.val(obj["wurl"]);
		if(obj["recruiterType"]) {
			settings.recruiterType.val(obj["recruiterType"]);
		}

		settings.location.val(obj["location"]);
		settings.about.val(obj["about"]);
		console.log(obj["about"]);
		settings.twitter.val(obj["turl"]);
		settings.facebook.val(obj["furl"]);
		settings.linkedIn.val(obj["lurl"]);

		$("input[name='notification-type'][value='"+obj["notificationEmail"]+"']").attr('checked', true);

		if(obj["availableCredits"]) {
			settings.buyMore.removeClass("hidden")
			settings.premiumDetail.text(obj["availableCredits"] + " credits left.")
		}
		else {
			settings.seeAllPremium.removeClass("hidden")
		}

	}

	function submitHandler(fn){
		$(settings.submitButton).click(function() {
			var type = $(this).closest(".settings-page").find(".settings-sidebar li.active").attr("data-selector")
			settings.type = type;
			fn(type)
		})
	}

	function updatePic(fn) {
		settings.uploadPic.click(fn)
	}

	function validatePic() {
		if(settings.fileUpload[0].files[0] != undefined) {
			return true
		}
		return false
	}

	function getPic() {

		if(settings.fileUpload[0].files[0] != undefined) {
			var form = new FormData();
			form.append("image", settings.fileUpload[0].files[0], settings.fileUpload[0].files[0].name);
			return form
		}


	}

	return {
		init: init,
		setConfig : setConfig,
		validate: validate,
		getProfile: getProfile,
		submitHandler: submitHandler,
		setProfile: setProfile,
		getPic: getPic,
		updatePic: updatePic,
		validatePic: validatePic
	}
}

function ifExists(element, checkWhiteSpace, select) {

	var value = checkWhiteSpace ? element.val() : (element.val()).trim()
	if(select) {
		value = parseInt(value)
	}
	if(!( element && value)){
		element.next('.error').text(errorResponses['missing'+element.attr('name')]).removeClass("hidden");
		focusOnElement(element)
		return false;
	}
	else if (!element.next('.error').hasClass("hidden")) {
		eraseError(element)
	}
	return true;
}

function checkEmail(element) {
	if(!element.val()){
		return true
	}
	if(!emailRegex.test(element.val())) {
		element.next('.error').text(errorResponses['invalid'+element.attr('name')]).removeClass("hidden");
		focusOnElement(element)
		return false;
	}
	else if (!element.next('.error').hasClass("hidden")) {
		eraseError(element)
	}
	return true;
}

function checkPassword(one, two){
	if(!(one.val() && two.val())) {
		return true
	}
	if(!ifBothMatches(one.val(), two.val())){
		two.next('.error').text(errorResponses['passwordMismatch']).removeClass("hidden")
		return false
	}
	eraseError(two)
	return true
}

function checkMinCharacters(ele, len) {
	if(!ele.val()) {
		return true
	}
	if(!checkCharacters(ele.val().length, len)) {
		ele.next('.error').text(errorResponses['minLength'+ele.attr('name')])
		return false
	}
	eraseError(ele)
	return true
}

function checkUrl(element) {
	if(!element.val()){
		return true
	}
	if(!urlRegex.test(element.val())) {
		element.next('.error').text(errorResponses['invalid'+element.attr('name')]).removeClass("hidden");
		focusOnElement(element)
		return false;
	}
	else if (!element.next('.error').hasClass("hidden")) {
		eraseError(element)
	}
	return true;
}

function checkPhone(element){
	if(!element.val()) {
		return true
	}
	if(!( element && element.val() && isValidPhone(element.val()) )){
		element.next('.error').text(errorResponses['invalidPhone']).removeClass("hidden");
		focusOnElement(element)
		return false;
	}
	else if (!element.next('.error').hasClass("hidden")) {
		eraseError(element)
	}
	return true
}

function eraseError(element){
	element.removeClass("error-border");
	element.next('.error').text('').addClass("hidden");
}

function focusOnElement(element) {
	element.addClass("error-border");
	$('html, body').animate({
		scrollTop: (element.closest('.formgroup').offset().top)
	},200);
}
