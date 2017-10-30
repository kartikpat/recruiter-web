var changePasswordForm = $(".change-password-form");

$(document).ready(function(){
    changePasswordForm.find(".change-password").click(changePassword);

    changePasswordForm.find(".field input").focusout(function() {
        checkErrorClass(this);
    });
	changePasswordForm.find(".field input").focusin(function() {
        removeErrorClass(this);
    });

})

var checkErrorClass = function(ele) {
	var elem = $(ele);
	var value = elem.val();
    if(elem.attr("name") == "password" || elem.attr("name") == "newPassword" ) {
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
    if(elem.attr("name") == "confirmPassword" ) {
		if(value == '') {
			elem.next().text("Please provide the password").removeClass("hidden");
			return false;
		}
		else {
			if(value.length < 5) {
				elem.next().text("Password must be of atleast five characters").removeClass("hidden");
				return false;
			}
			else if($("#newPassword").val() != $("#confirmPassword").val()){
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

var removeErrorClass = function(ele) {
	var elem = $(ele);
	elem.next().addClass("hidden");
}

var getValue = function(ele, obj) {
    var elem  = $(ele);
    obj[elem.attr("name")] = elem.val();
    return obj;
}

var changePassword = function() {
    var obj = {}
    changePasswordForm.find(".field input").each(function() {
        obj = getValue(this, obj);
		console.log(obj)
    });

	if(checkErrorClass($("#password")) && checkErrorClass($("#newPassword"))) {
		postRequest(baseUrl+"/recruiter/"+recruiterID+"/reset",  {},
				obj, successCallback )
		}
}

var successCallback = function(res) {
    console.log(res);
}
