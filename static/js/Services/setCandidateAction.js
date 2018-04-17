function setCandidateAction(recruiterId, jobId, action, applicationId , data, parameters){
	return postRequest(baseUrl+"/recruiter/"+recruiterId+"/job/"+jobId+"/application/"+applicationId+"/action/"+action, null, data, function(res, status, xhr){
		if(res.status && res.status =='success'){
			res["action"] = action;
			res["parameters"] = parameters;
			res["applicationId"] = applicationId;
			return pubsub.publish("setCandidateActionSuccess", res);
		}
	}, function(res,status,error) {
		res["action"] = action;
		res["parameters"] = parameters;
		return pubsub.publish("setCandidateActionFail", res);
	});
}
