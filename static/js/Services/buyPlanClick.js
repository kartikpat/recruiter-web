function buyPlanClick(recruiterId, data){
	postRequest(baseUrl+"/recruiter/"+recruiterId+"/buy", {} , data, function(res){
		if(res.status && res.status =='success'){
			res.extraParameters = {}
			res.extraParameters = data;
			return pubsub.publish("buyPlanClickSuccess", res);
		}
		},function(res,status,error) {
			res.extraParameters = {}
			res.extraParameters = data;
			return pubsub.publish("buyPlanClickFail", res);
	});
}
