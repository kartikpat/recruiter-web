function userResend(){
	var user= {}
	function init() {
		user.resendActive = $(".resendActive");
        user.secText = $(".secText");
        user.thirdText = $(".thirdText");
	}

	function submitHandler(fn){
		user.resendActive.click(fn);
	}

    function changeText() {
        user.secText.text("We've again sent you an email on")
        user.thirdText.text("If you still did not receive any email, check your spam folder or write to us at hello@iimjobs.com")
    }

	return {
		init: init,
		submitHandler: submitHandler,
        changeText: changeText
	}

}
