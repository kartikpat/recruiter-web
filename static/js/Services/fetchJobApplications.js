function fetchJobApplications(jobId,queryParameters, recruiterId){
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/jobs/"+jobId+"/applications", {
        status: queryParameters["status"],
		pageNumber: queryParameters["pageNumber"],
		pageContent: queryParameters["pageContent"]
    }, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("fetchedJobApplication:"+jobId, res);
		}
		return pubsub.publish("failedTofetchJobApplication:"+jobId, res);
	});
}
