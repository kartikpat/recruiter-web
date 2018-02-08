function fetchCalendars(jobId){
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/job/"+jobId+"", {}, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("fetchedCalendars:"+jobId, res.data);
		}
		return pubsub.publish("failedToFetchCalendars:"+jobId, res);
	});
}
