$(document).ready(function(){

	var recruiterProfile = Profile();

	recruiterProfile.init();
	recruiterProfile.setProfile(profile)

	recruiterProfile.submitHandler(function(type){

		if(recruiterProfile.validate()){

			if(type == "change-password") {
				var obj = recruiterProfile.getProfile();
				obj.email = profile.email
				return setPassword(recruiterId,obj )
			}
			updateRecruiterProfile(recruiterProfile.getProfile(), recruiterId);
		}
	})

	recruiterProfile.updatePic(function(){
		updateRecruiterProfile(recruiterProfile.getPic(), recruiterId);
	})

 	function onSuccessfulUpdateProfile(topic, data){
		toastNotify(1, "Profile Updated Success");
		setTimeout(function(){
			 location.reload()
		 }, 2000);
	}
	function onFailedUpdateProfile(topic, data){
		errorHandler(data)
	}

	function onSuccessfulSetPassword(topic, data){
		toastNotify(1, "Password Updated Success");

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
