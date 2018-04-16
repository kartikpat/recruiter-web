$(document).ready(function(){
	var recruiterProfile = Profile();
	console.log(profile);
	recruiterProfile.init();
	recruiterProfile.setProfile(profile)

	recruiterProfile.submitHandler(function(type){
		if(recruiterProfile.validate()){
			$('.spinner').removeClass('hidden');
			$('#uploadPic').addClass('hidden');
			$(".button.submit").addClass('hidden');
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
			return updateRecruiterProfile(recruiterProfile.getPic(), recruiterId);
		}
		return toastNotify(3, "Please Choose A File")
	})

 	function onSuccessfulUpdateProfile(topic, data){
		$('.spinner').removeClass('hidden');
		$('#uploadPic').addClass('hidden');
		$(".button.submit").addClass('hidden');
		toastNotify(1, "Profile Updated Success");
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
        return toastNotify(3, "Something went wrong");
    }
    return toastNotify(3, res.message);
}
