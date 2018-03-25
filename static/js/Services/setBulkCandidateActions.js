function setBulkCandidateActions(recruiterId, jobId, action , data, parameters){
	postRequest(baseUrl+"/recruiter/"+recruiterId+"/job/"+jobId+"/applications/action/"+action, null, data, function(res, status, xhr){
		if(res.status && res.status =='success'){
			res.action = action;
			res.parameters = parameters;
			res.applicationId = data.applicationId;
			return pubsub.publish("setCandidateBulkActionSuccess", res);
		}
	}, function(res,status,error) {
		return pubsub.publish("setCandidateBulkActionFail", res);
	});
}
