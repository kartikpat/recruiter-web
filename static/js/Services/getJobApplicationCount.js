function fetchJobApplicationCount(recruiterId, jobId){
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/jobs/"+jobId+"/applications/count", {}, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("fetchedApplicationCountSuccess", res.data);
		}

	}, function(res,status,error) {
	    return pubsub.publish("fetchedApplicationCountFail", res);
	});
}
