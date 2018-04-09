function fetchJobs(parameters, recruiterId){
	console.log(parameters);
	if(!parameters.type)
		parameters.type='all';
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/jobs", parameters, function(res){
		if(res.status && res.status =='success'){
			res.data.obj = {}
			res.data.obj.type = parameters.type;
			return pubsub.publish("fetchedJobs", res.data);
		}

	}, function(res,status,error) {
	    return pubsub.publish("fetchJobsFail", res);
	});
}
