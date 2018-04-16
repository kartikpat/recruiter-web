$(document).ready(function(){
	var recruiterProfile = Profile();
	recruiterProfile.init();
	recruiterProfile.setProfile(profile)

	recruiterProfile.submitHandler(function(type){
		if(recruiterProfile.validate()){
			console.log(type)
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
		errorHandler(data)
		$('.spinner').addClass('hidden');
		$('#uploadPic').removeClass('hidden');
		$(".button.submit").removeClass('hidden');
	}

	function onSuccessfulSetPassword(topic, data){
		toastNotify(1, "Password Updated Success");
		setTimeout(function(){
			 location.reload()
		 }, 2000);
	}
	function onFailedPassword(topic, data){
		errorHandler(data)
	}

	var updateRecruiterProfileSuccessSubscription = pubsub.subscribe("updateRecruiterProfileSuccess", onSuccessfulUpdateProfile);
	var updateRecruiterProfileFailSubscription = pubsub.subscribe("updateRecruiterProfileFail", onFailedUpdateProfile);

	var setPasswordSuccessSubscription = pubsub.subscribe("setPasswordSuccess", onSuccessfulSetPassword);
	var setPasswordFailSubscription = pubsub.subscribe("setPasswordFail", onFailedPassword);

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
