jQuery(document).ready( function() {

	var plan = Plans();
	plan.init()
	console.log(profile)
	plan.onClickSignatureBuy(function(planType) {
		// show loader
		var data = {}
		data.email = profile.email;
		data.phone = profile.phone;
		data.type = profile.planType;
		buyPlanClick(recruiterId, data);
	})
	plan.onClickPlatinumBuy(function(planType) {
		//show loader
		var data = {}
		data.email = profile.email;
		data.phone = profile.phone;
		data.type = profile.planType;
		buyPlanClick(recruiterId, data);
	})
	plan.onClickBuyPlan(function(planType){
		alert(planType)
		return
		buyPlan(recruiterId, jobId, "comment" , applicationId, ob);
	})

	function onSuccessfulPlanClickSuccess(topic, data) {
		//success loader
	}

	function onFailedPlanClick(topic, data) {
		// fail loader
		errorHandler(data)
	}

	function onSuccessfulPlanSuccess(topic, data) {

	}

	function onFailedPlan(topic, data) {
		jobList.hideLoaderOverlay()
		jobList.openModal("unpublish")
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
