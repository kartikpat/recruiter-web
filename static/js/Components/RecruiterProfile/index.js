$(document).ready(function(){
	var recruiterProfile = Profile();
	recruiterProfile.init();
	recruiterProfile.setProfile(profile)
	fetchRecruiterCredits(recruiterId);

	var successMsg = getQueryParameter("credit");
	console.log(successMsg)
	var queryParam = getQueryParameter("social")

	if((queryParam)) {
        var newUrl = removeParam("credit", window.location.href)
        window.history.replaceState("object or string", "Title", newUrl);
		recruiterProfile.setSocialView();
	}

    if((successMsg)) {
        var newUrl = removeParam("credit", window.location.href)
        window.history.replaceState("object or string", "Title", newUrl);
		recruiterProfile.setCreditsView();
	}

	recruiterProfile.submitHandler(function(type){
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
		if(recruiterProfile.creditsValidate()){
			$('.spinner').removeClass('hidden');
			$('#credits-distribute').addClass('hidden');
			var data=recruiterProfile.getAddCredits();
			submitCredits(data,recruiterId);
		}

	})

	recruiterProfile.onClickcredits(function(){
		// debugger
		// recruiterProfile.emptyCredits();
		// recruiterProfile.spinner();

	})

	recruiterProfile.onClickDeleteCredits(function(data){
		reclaimCredits(data,recruiterId);
	})

	recruiterProfile.updatePic(function(){
		if(recruiterProfile.validatePic()) {
			$('#uploadPic').prev().removeClass('hidden');
			$('#uploadPic').addClass('hidden');
			var extraParameters = {};
			extraParameters.type = "pic-profile";
			return updateRecruiterProfile(recruiterProfile.getPic(), recruiterId,extraParameters);
		}
		return toastNotify(3, "Please choose a file of Max size of 800K")
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
			toastNotify(1, "Profile updated successfully");
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
		toastNotify(1, "Password Updated Successfully");
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
		$(".credits").removeClass('hidden');		
		recruiterProfile.togglespinner();
		recruiterProfile.credits(data);
	}

	function onFetchFail(topic){
		recruiterProfile.spinner();
	}

	function onSuccessfulSubmitCredit(){
		$('.spinner').addClass('hidden');
		$('#credits-distribute').removeClass('hidden');
		window.location.href = location+"?credit=1";
	}

	function onFailedSubmitCredit(){
		$('.spinner').addClass('hidden');
		$('#credits-distribute').removeClass('hidden');
	}

	function onSuccessfulReclaimCredit(){
		window.location.href = location+"?credit=1";
	}

	function onFailedReclaimCredit(){
		$('.cancelTeamMember').removeClass('hidden');
	}


	var updateRecruiterProfileSuccessSubscription = pubsub.subscribe("updateRecruiterProfileSuccess", onSuccessfulUpdateProfile);
	var updateRecruiterProfileFailSubscription = pubsub.subscribe("updateRecruiterProfileFail", onFailedUpdateProfile);

	var setPasswordSuccessSubscription = pubsub.subscribe("setPasswordSuccess", onSuccessfulSetPassword);
	var setPasswordFailSubscription = pubsub.subscribe("setPasswordFail", onFailedPassword);

	var fetchCreditSuccessSubscription=pubsub.subscribe('fetchedCredits', onFetchSuccess)
	var fetchCreditFailSubscription=pubsub.subscribe('failedToFetchCredits', onFetchFail)

	var creditSubmitSuccessSubscription = pubsub.subscribe('submittedCredits',onSuccessfulSubmitCredit);
    var creditSubmitFailSubscription = pubsub.subscribe('failedCreditSubmission',onFailedSubmitCredit);

	var creditReclaimSuccessSubscription = pubsub.subscribe('reclaimCreditsSuccess',onSuccessfulReclaimCredit);
    var creditReclaimFailSubscription = pubsub.subscribe('reclaimCreditsfail',onFailedReclaimCredit);


})

function errorHandler(data) {
    var res = data.responseJSON
    if(!res) {
        return toastNotify(3, "Looks like you are not connected to the internet");
    }
	if(data.status == 401) {
		return toastNotify(3, "The original password you've entered is incorrect");
	}
	if(data.status == 503) {
        toastNotify(3, "Oops...something went wrong. Our engineers are fixing the issue");
         return
    }
    return toastNotify(3, res.message);
}
