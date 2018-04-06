function fetchFollowUps(recruiterId, parameters){
	getRequest(baseUrl+"/recruiter/"+recruiterId+"/followUps", parameters, function(res){
		if(res.status && res.status =='success'){
			pubsub.publish("fetchedFollowups", res.data);
		}
	}, function(res,status,error) {
		return pubsub.publish("failedTofetchFollowups", res);
	});
}
