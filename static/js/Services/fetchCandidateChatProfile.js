function fetchCandidateChatProfile(recruiterId,Id){
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/applications/"+Id+"",{}, function(res){
		if(res.status && res.status =='success') {
			res.obj = {}
			res.obj.applicationId = applicationId;
			return pubsub.publish("fetchCandidateProfile", res);
		}

	}, function(res,status,error) {
		return pubsub.publish("fetchCandidateProfileFail", res);
	});
}
