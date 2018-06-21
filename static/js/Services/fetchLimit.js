function fetchLimit(recruiterId){
    return getRequest(baseUrl+"/recruiter/"+recruiterId+"/limit",{}, function(res){
        if(res.status && res.status =='success'){
     		return pubsub.publish("fetchLimitSuccess", res);
		}

	}, function(res,status,error) {
	    return pubsub.publish("fetchLimitFail", res);
	});
}
