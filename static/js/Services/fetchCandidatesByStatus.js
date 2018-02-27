function fetchCandidatesByStatus(jobId,parameters, recruiterId){
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/jobs/"+jobId+"/applications", parameters, function(res){
		if(res.status && res.status =='success'){
			res.pageNumber = parameters.pageNumber;
			return pubsub.publish("fetchCandidatesByStatusSuccess", res);
		}
		return pubsub.publish("fetchCandidatesByStatusFail", res.responseJSON);
	});
}
