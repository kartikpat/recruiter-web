$(document).ready(function(){
	var recruiterProfile = Profile();
	recruiterProfile.init();
	recruiterProfile.setProfile(profile)
	
	recruiterProfile.submitHandler(function(){

		if(recruiterProfile.validate()){

			$('.'+type+'').find('.spinner').removeClass('hidden');
			// $('#uploadPic').addClass('hidden');
			$('.'+type+'').find(".button.submit").addClass('hidden');
			if(type == "change-password") {

				var obj = recruiterProfile.getProfile();
				obj.email = profile.email
				return setPassword(recruiterId,obj )
			}

			updateRecruiterProfile(recruiterProfile.getProfile(), recruiterId);
		}
	})

	recruiterProfile.submitCredit(function(){
			var data=recruiterProfile.getAddCredits();
			// submitCredits(data,recruiterId);
		
	})

	recruiterProfile.onClickcredits(function(){
		fetchRecruiterCredits(recruiterId);
	})

	recruiterProfile.updatePic(function(){
		if(recruiterProfile.validatePic()) {
			$('#uploadPic').prev().removeClass('hidden');
			$('#uploadPic').addClass('hidden');
			var extraParameters = {};
			extraParameters.type = "pic-profile";
			return updateRecruiterProfile(recruiterProfile.getPic(), recruiterId,extraParameters);
		}
		return toastNotify(3, "Please Choose A File")
	})


 	function onSuccessfulUpdateProfile(topic, data){
		$('.spinner').addClass('hidden');
		$('#uploadPic').removeClass('hidden');
		$(".button.submit").removeClass('hidden');
		if(data.extraParameters && data.extraParameters.type == "pic-profile")
		{
			toastNotify(1, "Profile Pic Uploaded Successfully");
		}
		else {
			toastNotify(1, "Profile Updated Success");
		}

		setTimeout(function(){
			 location.reload()
		 }, 2000);
	}
	function onFailedUpdateProfile(topic, data){
		$('.spinner').addClass('hidden');
		$('#uploadPic').removeClass('hidden');
		$(".button.submit").removeClass('hidden');
		errorHandler(data)

	}

	function onSuccessfulSetPassword(topic, data){
		$('.spinner').addClass('hidden');
		$(".button.submit").removeClass('hidden');
		toastNotify(1, "Password Updated Success");
		setTimeout(function(){
			 location.reload()
		 }, 2000);
	}
	function onFailedPassword(topic, data){
		$('.spinner').addClass('hidden');
		$(".button.submit").removeClass('hidden');
		errorHandler(data)
	}

	function onFetchSuccess(topic,data){
		recruiterProfile.credits(data);
	}

	function onFetchFail(topic){
		console.log("here");
	}

	function onSuccessfulSubmitCredit(){
		
	}

	function onFailedSubmitCredit(){
		
	}

	var updateRecruiterProfileSuccessSubscription = pubsub.subscribe("updateRecruiterProfileSuccess", onSuccessfulUpdateProfile);
	var updateRecruiterProfileFailSubscription = pubsub.subscribe("updateRecruiterProfileFail", onFailedUpdateProfile);

	var setPasswordSuccessSubscription = pubsub.subscribe("setPasswordSuccess", onSuccessfulSetPassword);
	var setPasswordFailSubscription = pubsub.subscribe("setPasswordFail", onFailedPassword);
	
	var fetchCreditSuccessSubscription=pubsub.subscribe('fetchedCredits', onFetchSuccess)
	var fetchCreditFailSubscription=pubsub.subscribe('failedToFetchCredits', onFetchFail)

	var creditSubmitSuccessSubscription = pubsub.subscribe('submittedCredits',onSuccessfulSubmitCredit);
    var creditSubmitFailSubscription = pubsub.subscribe('failedCreditSubmission',onFailedSubmitCredit);


})

function errorHandler(data) {
    var res = data.responseJSON
    if(!res) {
        return toastNotify(3, "Looks like you are not connected to the internet");
    }
	if(data.status == 401) {
		return toastNotify(3, "The original password you've entered is incorrect");
	}
    return toastNotify(3, res.message);
}
