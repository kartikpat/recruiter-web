function fetchRecruiterTags(recruiterId, parameters){
	getRequest(baseUrl+"/recruiter/"+recruiterId+"/tags", parameters, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("fetchedTags", res);
		}
        return pubsub.publish("fetchTagsFail", res);
	});
}
