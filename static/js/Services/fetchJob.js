function fetchJob(jobId, recruiterId, parameters){
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/job/"+jobId+"", parameters, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("fetchedJob:"+jobId, res.data);
		}
		return pubsub.publish("failedToFetchJob:"+jobId, res);
	});
}
