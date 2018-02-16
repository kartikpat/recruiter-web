function setCandidateAction(recruiterId, jobId, action, applicationId , data, parameters){
	postRequest(baseUrl+"/recruiter/"+recruiterId+"/job/"+jobId+"/application/"+applicationId+"/action/"+action, null, data, function(res, status, xhr){
		if(res.status && res.status =='success'){
			res.action = action;
			res.parameters = parameters;
			res.applicationId = applicationId; 
			return pubsub.publish("setCandidateActionSuccess", res);
		}
	}, function(res){
		return pubsub.publish("setCandidateActionFail", res);
	});
}
