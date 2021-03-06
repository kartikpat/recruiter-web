function fetchCandidateProfile(recruiterId, jobId, applicationId){
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/jobs/"+jobId+"/applications/"+applicationId+"",{}, function(res){
		if(res.status && res.status =='success') {
			res.obj = {}
			res.obj.applicationId = applicationId;
			return pubsub.publish("fetchCandidateProfile", res);
		}

	}, function(res,status,error) {
		return pubsub.publish("fetchCandidateProfileFail", res);
	});
}
