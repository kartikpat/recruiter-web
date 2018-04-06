jQuery(document).ready( function() {

	var plan = Plans();
	plan.init()
	plan.onClickBuyPlan(function(planType){
		alert(planType)
		return
		buyPlan(recruiterId, jobId, "comment" , applicationId, ob);
	})
})
