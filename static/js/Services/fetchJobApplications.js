function fetchJobApplications(jobId,parameters, recruiterId){
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/jobs/"+jobId+"/applications", parameters, function(res){
		if(res.status && res.status =='success'){
			res.pageNumber = parameters.pageNumber;
			res.obj = {}
			res.obj.status = parameters.status;
			return pubsub.publish("fetchedJobApplication", res);
		}

	}, function(res,status,error) {
	    return pubsub.publish("failedTofetchJobApplication", res);
	});
}
