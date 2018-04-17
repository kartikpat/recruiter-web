jQuery(document).ready( function() {

	var successMsg = getQueryParameter("jobPostMessage");
	var jobId = getQueryParameter("jobId")

	if(isEmpty(jobId)) {
		jobId = 0;
	}

	var newUrl;
	if(!isEmpty(jobId)) {
        newUrl = removeParam("jobId", window.location.href)
		window.history.replaceState("object or string", "Title", newUrl);
    }

    if(!isEmpty(successMsg)) {
        toastNotify(1, decodeURIComponent(successMsg))
        newUrl = removeParam("jobPostMessage", window.location.href)
		window.history.replaceState("object or string", "Title", newUrl);
    }

	var plan = Plans();
	plan.init()
	plan.onClickSignatureBuy(function(planType) {
		plan.showSpinner("signature");
		var data = {}
		data.email = profile.email;
		data.phone = profile.phone;
		data.planName = planType;
		data.jobId = jobId;
		data.recruiterName = profile.name;

		buyPlanClick(recruiterId, data);
	})
	plan.onClickPlatinumBuy(function(planType) {
		plan.showSpinner("platinum");
		var data = {}
		data.email = profile.email;
		data.phone = profile.phone;
		data.planName = planType;
		data.jobId = jobId;
		data.recruiterName = profile.name;
		buyPlanClick(recruiterId, data);
	})
	plan.onClickBuyPlan(function(phone, planType){
		// plan.showContinueSpinner(planType);
		var data = {}
		data.email = profile.email;
		data.phone = phone;
		data.planName = planType;
		data.jobId = jobId;
		data.recruiterName = profile.name;
		buyPlan(recruiterId, data);
	})

	function onSuccessfulPlanClickSuccess(topic, data) {
		if(data.extraParameters.planName == "signature" ) {
			plan.hideSpinner("signature");
			plan.openModal("signature");
		}
		if(data.extraParameters.planName == "platinum" ) {
			plan.hideSpinner("platinum");
			plan.openModal("platinum");
		}
	}

	function onFailedPlanClick(topic, data) {
		if(data.extraParameters.planName == "signature" ) {
			plan.hideSpinner("signature");
		}
		if(data.extraParameters.planName == "platinum" ) {
			plan.hideSpinner("platinum");
		}
		errorHandler(data)
	}

	function onSuccessfulPlanSuccess(topic, data) {
		if(data.extraParameters.planName == "signature" ) {
			// plan.hideContinueSpinner("signature");
			plan.closeModal();
		}
		if(data.extraParameters.planName == "platinum" ) {
			// plan.hideContinueSpinner("platinum");
			plan.closeModal();
		}
		window.location = "/my-jobs"
	}

	function onFailedPlan(topic, data) {
		if(data.extraParameters.planName == "signature" ) {
			// plan.hideContinueSpinner("signature");
		}
		if(data.extraParameters.planName == "platinum" ) {
			// plan.hideContinueSpinner("platinum");
		}
		errorHandler(data)
	}

	var planClickSuccessSubscription = pubsub.subscribe('buyPlanClickSuccess', onSuccessfulPlanClickSuccess);
	var planClickFailSubscription = pubsub.subscribe('buyPlanClickFail', onFailedPlanClick);

	var planSuccessSubscription = pubsub.subscribe('buyPlanSuccess', onSuccessfulPlanSuccess);
	var planFailSubscription = pubsub.subscribe('buyPlanFail', onFailedPlan);
})

function errorHandler(data) {
    var res = data.responseJSON
    if(!res) {
        return toastNotify(3, "Looks like you are not connected to the internet");
    }
    return toastNotify(3, res.message);
}
