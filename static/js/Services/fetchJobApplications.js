function fetchJobApplications(jobId,status, recruiterId){
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/jobs/"+jobId+"/applications", {
        status: status
    }, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("fetchedJobApplication:"+jobId, res);
		}
		return pubsub.publish("failedTofetchJobApplication:"+jobId, res);
	});
}
