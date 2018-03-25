function fetchRecruiterTags(recruiterId, parameters){
	getRequest(baseUrl+"/recruiter/"+recruiterId+"/tags", parameters, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("fetchedTags", res);
		}
	}, function(res,status,error) {
	    return pubsub.publish("fetchTagsFail", res);
	});
}
