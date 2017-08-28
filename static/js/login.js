var loginForm = $(".login-container");

$(document).ready(function() {
    loginForm.find(".register").click(registerUser);
    loginForm.find(".log-in").click(loginUser);

    loginForm.find(".register-form input,select").on('input',function() {
        checkErrorClass(this);
    });
    loginForm.find(".login-form input").on('input',function() {
        checkErrorClass(this);
    });
    loginForm.find('#password, #confirm-password').on('keyup', isSamePassword);
    loginForm.find('.lost-paswd-link').click(showForgotPasswordForm);
    loginForm.find('.forgot-password-form input').on('input',function() {
        checkErrorClass(this);
    });
});

//loginForm.find(".forgot-password-form").on('click',".send-forgot-paswd",sendForgotPaswd);

var sendForgotPaswd = function() {
    loginForm.find('.forgot-password-form input').on('input',function() {
        checkErrorClass(this);
    });
}

var showForgotPasswordForm = function(event) {
    event.preventDefault();
    $(".forgot-password-form").toggleClass("hidden");
}

var isSamePassword = function() {
    if($('#password').val() === $('#confirm-password').val()) {
        $('#same-password').addClass('hidden');
    } else
        $('#same-password').removeClass('hidden');
    }

var checkErrorClass = function(ele) {
    var elem = $(ele);
    elem.val() === '' ? elem.next().removeClass("hidden"): elem.next().addClass("hidden");
}

var getValue = function(ele, obj) {
    var elem  = $(ele);
    obj[elem.attr("name")] = elem.val();
    return obj;
}

var registerUser = function() {
    var obj = {}
    loginForm.find(".register-form input,select").each(function() {
        checkErrorClass(this);
        obj = getValue(this, obj);
    });
}

var loginUser = function() {
    var obj = {}
    loginForm.find(".login-form input").each(function() {
        checkErrorClass(this);
        obj = getValue(this, obj);
    });
    console.log(obj);
}
