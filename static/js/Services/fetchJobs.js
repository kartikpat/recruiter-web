function fetchJobs(parameters, recruiterId){
	if(!parameters.type)
		parameters.type='all';
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/jobs", parameters, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("fetchedJobs", res.data);
		}

	}, function(res,status,error) {
	    return pubsub.publish("fetchJobsFail", res);
	});
}
