function downloadMassResume(recruiterId,jobId, parameters){
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/jobs/"+jobId+"/applications/download/resume", parameters, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("downloadedSuccess", res);
		}
		return pubsub.publish("downloadedFail", res);
	});
}
