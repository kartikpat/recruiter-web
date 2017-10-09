var loginForm = $(".login-container");

var baseUrl = "http://13.126.92.102:8000";
var recruiterID = localStorage.id;

$(document).ready(function(){
	$(".login-tab.jobseeker").click(function(){
		window.location = "https://www.updazz.com/registration/login.php";
	})

	//loginForm.find('#login-email').on('keyup', validateEmail);

	loginForm.find(".register").click(registerUser);
    loginForm.find(".log-in").click(loginUser);

    loginForm.find(".register-form input,select").focusout(function() {
        checkErrorClassRegister(this);
    });
	loginForm.find(".register-form input").focusin(function() {
        removeErrorClass(this);
    });
    loginForm.find(".login-form input[data-attribute=1]").focusout(function() {
        checkErrorClassLogin(this);
    });
	loginForm.find(".login-form input[data-attribute=1]").focusin(function() {
        removeErrorClass(this);
    });
    loginForm.find('#password, #confirm-password').on('keyup', isSamePassword);
    loginForm.find('.lost-paswd-link').click(showForgotPasswordForm);

});

/**
 * error handler for login
 * @param  {object} res ajax response object
 */
function authFail(res){
	$(".error-message").text(res.message);
	console.log(res.status);
}

/**
 * success handler for login
 * @param  {object} res ajax response object
 */
function authSuccess(res){
	console.log(res)
	if(res.status=="success"){
		localStorage.id = res["data"][0]["id"];
		window.location="/";
	}
	else
		$(".error-message").text(res.message);
}

loginForm.find('.forgot-password-form input').focusout(function() {
	checkErrorClassForgotPassword(this);
});

loginForm.find('.forgot-password-form input').focusin(function() {
	removeErrorClass(this);
});

var sendForgotPaswd = function() {
	var obj = {}
    loginForm.find(".forgot-password-form input").each(function() {

        obj = getValue(this, obj);
		console.log(obj);
    });
	if(checkErrorClassForgotPassword($("#forgot-password-email")) ) {
		postRequest(baseUrl+"/recruiter/"+recruiterID+"/recover",  null, {
				email: obj["forgot-password-email"]
			}, forgotPasswordSuccess )
		}
}

var forgotPasswordSuccess = function(res) {
	if(res["status"] == "success") {
		loginForm.find(".forgot-password-message").removeClass("hidden");
	}
}

loginForm.find(".forgot-password-form").on('click',".forgot-password-close-message", function(){
	$(this).parent().addClass("hidden");
});


loginForm.find(".forgot-password-form").on('click',".send-forgot-paswd",sendForgotPaswd);



var checkErrorClassForgotPassword = function(ele) {
	var elem = $(ele);
	var value = elem.val();
	if(elem.attr("id") == "forgot-password-email") {
		if(value == '') {
			elem.next().text("Please enter the email address").removeClass("hidden");
			return false;
		}
		else {
			if(!(isEmail(value))) {
				elem.next().text("Please enter valid email address").removeClass("hidden");
				return false;
			}
			else {
				elem.next().addClass("hidden");
				return true;
			}
		}
	}
}

var showForgotPasswordForm = function(event) {
    event.preventDefault();
    $(".forgot-password-form").toggleClass("hidden");
}

var isSamePassword = function() {
    if($('#password').val() != $('#confirm-password').val()) {
        $('#confirm-password').next().text("Password and confirm Password should be same").removeClass("hidden");
    } else
        $('#confirm-password').next().addClass('hidden');
    }

var removeErrorClass = function(ele) {
	var elem = $(ele);
	elem.next().addClass("hidden");
}

var checkErrorClassRegister = function(ele) {
	var elem = $(ele);
	var value = elem.val();
	if(elem.attr("id") == "name") {
		if(value == '') {
			elem.next().text("Please enter the name").removeClass("hidden");
			return false;
		}
		else {
			elem.next().addClass("hidden");
			return true;
		}
	}
	if(elem.attr("id") == "designation") {
		if(value == '') {
			elem.next().text("Please enter the designation").removeClass("hidden");
			return false;
		}
		else {
			elem.next().addClass("hidden");
			return true;
		}
	}
	if(elem.attr("id") == "organisation") {
		if(value == '') {
			elem.next().text("Please enter the organisation").removeClass("hidden");
			return false;
		}
		else {
			elem.next().addClass("hidden");
			return true;
		}
	}
	if(elem.attr("id") == "recruiter-type") {
		if(value == '') {
			elem.next().text("Please select the recruiter Type").removeClass("hidden");
			return false;
		}
		else {
			elem.next().addClass("hidden");
			return true;
		}
	}
	if(elem.attr("id") == "email") {
		if(value == '') {
			elem.next().text("Please enter the email address").removeClass("hidden");
			return false;
		}
		else {
			if(!(isEmail(value))) {
				elem.next().text("Please enter valid email address").removeClass("hidden");
				return false;
			}
			else {
				elem.next().addClass("hidden");
				return true;
			}
		}
	}
	if(elem.attr("id") == "phone") {
		if(value == '') {
			elem.next().text("Please provide the phone").removeClass("hidden");
			return false;
		}
		else {
			if(!(isPhone(value))) {
				elem.next().text("Please enter valid phone(Digits only and 10 digits)").removeClass("hidden");
				return false;
			}
			else {
				elem.next().addClass("hidden");
				return true;
			}
		}
	}
	if(elem.attr("id") == "password" ) {
		if(value == '') {
			elem.next().text("Please provide the password").removeClass("hidden");
			return false;
		}
		else {
			if(value.length < 5) {
				elem.next().text("Password must be of atleast five characters").removeClass("hidden");
				return false;
			}
			else {
				elem.next().addClass("hidden");
				return true;
			}
		}
	}
	if(elem.attr("id") == "confirm-password" ) {
		if(value == '') {
			elem.next().text("Please provide the password").removeClass("hidden");
			return false;
		}
		else {
			if(value.length < 5) {
				elem.next().text("Password must be of atleast five characters").removeClass("hidden");
				return false;
			}
			else if($("#password").val() != $("#confirm-password").val()){
				elem.next().text("Password and confirm Password should be same").removeClass("hidden");
				return false;
			}
			else {

				elem.next().addClass("hidden");
				return true;
			}
		}
	}
}

var isPhone = function(val) {
	if (/^\d{10}$/.test(val)) {
	    return true;
	} else {
    return false
	}
}

var checkErrorClassLogin = function(ele) {
    var elem = $(ele);
	var value = elem.val();
	console.log(value)
	if(elem.attr("id") == "login-email") {
		if(value == '') {
			elem.next().text("Please enter the email address").removeClass("hidden");
			return false;
		}
		else {
			if(!(isEmail(value))) {
				elem.next().text("Please enter valid email address").removeClass("hidden");
				return false;
			}
			else {
				elem.next().addClass("hidden");
				return true;
			}
		}
	}
 	if(elem.attr("id") == "login-password") {
		if(value == '') {
			elem.next().text("Please enter the password").removeClass("hidden");
			return false;
		}
		else {
			if(value.length < 5) {
				elem.next().text("Password must be of atleast five characters").removeClass("hidden");
				return false;
			}
			else {
				elem.next().addClass("hidden");
				return true;
			}
		}
	}
}

var getValue = function(ele, obj) {
    var elem  = $(ele);
    obj[elem.attr("name")] = elem.val();
    return obj;
}

var registerUser = function() {
    var obj = {}
    loginForm.find(".register-form input,select").each(function() {

        obj = getValue(this, obj);
		console.log(obj);
    });
	if(checkErrorClassRegister($("#name")) && checkErrorClassRegister($("#email")) && checkErrorClassRegister($("#password")) && checkErrorClassRegister($("#confirm-password")) && checkErrorClassRegister($("#phone")) && checkErrorClassRegister($("#designation")) && checkErrorClassRegister($("#organisation")) && checkErrorClassRegister($("#recruiter-type")) ) {
		postRequest(baseUrl+"/recruiter/register",  null, {
				email: obj["email"],
				name: obj["name"],
				password: obj["password"],
				phone: obj["phone"],
				type: obj["recruiter-type"],
				organisation: obj["organisation"],
				designation: obj["designation"]
			}, authRegisterSuccess ,null , null , authFail )
		}

}

function authRegisterSuccess(res){
	console.log(res)
	if(res.status=="success"){
		window.location="/recruiter/export-profile";
	}
	else
		$(".error-message").text(res.message);
}

var loginUser = function() {
    var obj = {}
    loginForm.find(".login-form input[data-attribute = 1]").each(function() {
        obj = getValue(this, obj);
		console.log(obj)
    });

	if(checkErrorClassLogin($("#login-email")) && checkErrorClassLogin($("#login-password"))) {
		postRequest("/sign-in",  null,
				obj
			, authSuccess ,null , null , authFail , true ,true, null,"application/x-www-form-urlencoded; charset=UTF-8" )
		}
}

function isEmail(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
};

// $(".log-in").click(function(event){
// 	event.preventDefault();
// 	var id= $("#userName").val();
// 	var userEmail = $("#login-email").val();
// 	var userPassword = $("#login-password").val();
// 	localStorage.id = id;
// 	postRequest(baseUrl+"/recruiter/login",  null, {
// 		email: userEmail,
// 		password: password
// 	}), successCallback )
// })
