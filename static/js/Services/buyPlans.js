function buyPlan(recruiterId, data){
	postRequest(baseUrl+"/recruiter/"+recruiterId+"/buy-continue", null , data, function(res){
		if(res.status && res.status =='success'){
			res.extraParameters = {}
			res.extraParameters = data;
			return pubsub.publish("buyPlanSuccess", res);
		}
		},function(res,status,error) {
			res.extraParameters = {}
			res.extraParameters = data;
			return pubsub.publish("buyPlanFail", res);
	});
}
