function fetchFiltersCount(recruiterId, jobId, parameters){
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/jobs/"+jobId+"/applications/count", parameters, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("fetchedFiltersCountSuccess", res.data);
		}
	}, function(res,status,error) {
	    return pubsub.publish("fetchedFiltersCountFail", res);
	});
}
