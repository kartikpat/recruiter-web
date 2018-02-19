function setBulkCandidateActions(recruiterId, jobId, action, applicationId , data, parameters){
	postRequest(baseUrl+"/recruiter/"+recruiterId+"/job/"+jobId+"/applications/action/"+action, null, data, function(res, status, xhr){
		if(res.status && res.status =='success'){
			res.action = action;
			res.parameters = parameters;
			res.applicationId = applicationId;
			return pubsub.publish("setCandidateBulkActionSuccess", res);
		}
	}, function(res){
		return pubsub.publish("setCandidateBulkActionFail", res.responseJSON);
	});
}
