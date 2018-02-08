function fetchCalendars(jobId, recruiterId){
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/job/"+jobId+"", {}, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("fetchedCalendars:"+jobId, res.data);
		}
		return pubsub.publish("failedToFetchCalendars:"+jobId, res);
	});
}
