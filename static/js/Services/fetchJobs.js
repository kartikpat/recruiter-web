function fetchJobs(type, recruiterId){
	if(!type)
		type='all';
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/jobs", {type: type}, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("fetchedJobs", res.data);
		}
		return pubsub.publish("fetchJobsFail", res);
	});
}
