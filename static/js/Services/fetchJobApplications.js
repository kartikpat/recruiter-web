function fetchJobApplications(jobId,parameters, recruiterId){
	if(parameters && parameters.status=="all")
		parameters.status=""
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/jobs/"+jobId+"/applications", parameters, function(res){
		if(res.status && res.status =='success'){
			res.pageNumber = parameters.pageNumber;
			res.offset=parameters.offset;
			res.obj = {},
			res.obj.status = parameters.status;
			return pubsub.publish("fetchedJobApplication", res);
		}

	}, function(res,status,error) {
	    return pubsub.publish("failedTofetchJobApplication", res);
	});
}
