function fetchCandidatesByTags(jobId,parameters, recruiterId){
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/jobs/"+jobId+"/applications", parameters, function(res){
		if(res.status && res.status =='success'){
			res.pageNumber = parameters.pageNumber;
			return pubsub.publish("fetchedJobApplication:"+jobId, res);
		}
		return pubsub.publish("failedTofetchJobApplication:"+jobId, res.responseJSON);
	});
}
