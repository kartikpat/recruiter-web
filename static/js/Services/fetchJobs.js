function fetchJobs(type, recruiterId, pageContent, pageNumber){
	if(!type)
		type='all';
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/jobs", {
		type: type,
		pageContent: pageContent,
		pageNumber: pageNumber
	}, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("fetchedJobs", res.data);
		}
		return pubsub.publish("fetchJobsFail", res);
	});
}
