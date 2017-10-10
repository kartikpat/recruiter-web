var resetPasswordForm = $(".reset-password-form");
var passKey;
var email;

$(document).ready(function(){

    passKey = getUrlParameter("k");
    email = getUrlParameter("e");

    resetPasswordForm.find(".set-new-password").click(setPassword);

    resetPasswordForm.find(".field input").focusout(function() {
        checkErrorClass(this);
    });
	resetPasswordForm.find(".field input").focusin(function() {
        removeErrorClass(this);
    });

})

var checkErrorClass = function(ele) {
	var elem = $(ele);
	var value = elem.val();
    if(elem.attr("name") == "newPassword" ) {
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

var setPassword = function() {
    var obj = {}
    resetPasswordForm.find(".field input").each(function() {
        obj = getValue(this, obj);

    });

    console.log(obj)

	if(checkErrorClass($("#newPassword"))) {
		postRequest(baseUrl+"/recruiter/"+recruiterID+"/set",  null,
				{
                    email: email,
                    key: passKey,
                    password: obj["newPassword"]
                }, successCallback )
		}
}

var successCallback = function(res) {
    if(res["status"] == "success") {
         window.location = "/sign-in?setNewPassword=1"

    }
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
