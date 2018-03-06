$(document).ready(function(){

	var recruiterProfile = Profile();

	recruiterProfile.init();
	recruiterProfile.setProfile(profile)

	recruiterProfile.submitHandler(function(){

		if(recruiterProfile.validate()){
			debugger
			updateRecruiterProfile(recruiterProfile.getProfile(), recruiterId);
		}
	})

	recruiterProfile.updatePic(function(){
		updateRecruiterProfile(recruiterProfile.getPic(), recruiterId);
	})

 	function onSuccessfulUpdateProfile(topic, data){
		return toastNotify(1, "Profile Updated Success");
	}
	function onFailedUpdateProfile(topic, data){
		errorHandler(data)
	}

	var updateRecruiterProfileSuccessSubscription = pubsub.subscribe("updateRecruiterProfileSuccess", onSuccessfulUpdateProfile);
	var updateRecruiterProfileFailSubscription = pubsub.subscribe("updateRecruiterProfileFail", onFailedUpdateProfile);

})

function errorHandler(data) {
    if(!data) {
        return toastNotify(3, "Something went wrong");
    }
    return toastNotify(3, data.message);
}
