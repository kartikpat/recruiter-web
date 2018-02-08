function fetchJob(jobId, recruiterId){
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/job/"+jobId+"", {}, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("fetchedJob:"+jobId, res.data);
		}
		return pubsub.publish("failedToFetchJob:"+jobId, res);
	});
}
