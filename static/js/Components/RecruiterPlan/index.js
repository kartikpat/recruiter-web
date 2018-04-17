jQuery(document).ready( function() {

	var plan = Plans();
	plan.init()
	console.log(profile)
	plan.onClickSignatureBuy(function(planType) {
		$('#signature-buy').addClass('hidden');
		$('#signature-buy').prev().removeClass('hidden');
		var data = {}
		data.email = profile.email;
		data.phone = profile.phone;
		data.type = profile.planType;
		buyPlanClick(recruiterId, "comment" , applicationId, ob);
	})
	plan.onClickPlatinumBuy(function(planType) {
		$('#platinum-buy').addClass('hidden');
		$('#platinum-buy').prev().removeClass('hidden');
		var data = {}
		data.email = profile.email;
		data.phone = profile.phone;
		data.type = profile.planType;
		buyPlanClick(recruiterId, "comment" , applicationId, ob);
	})
	plan.onClickBuyPlan(function(planType){
		alert(planType)
		return
		buyPlan(recruiterId, jobId, "comment" , applicationId, ob);
	})

	function onSuccessfulPlanClickSuccess(topic, data) {
		$('.button').removeClass('hidden');
		$('.spinner').addClass('hidden');
	}

	function onFailedPlanClick(topic, data) {
		$('.button').removeClass('hidden');
		$('.spinner').addClass('hidden');
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
