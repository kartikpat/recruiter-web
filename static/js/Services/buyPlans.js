function buyPlan(recruiterId, data){
	postRequest(baseUrl+"/recruiter/"+recruiterId+"/calendar/"+calendarId, null , data, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("buyPlanSuccess", res);
		}
		},function(res,status,error) {
			return pubsub.publish("buyPlanFail", res);
	});
}
 
