function setCandidateAction(recruiterId, jobId, action, applicationId , data){
	postRequest(baseUrl+"/recruiter/"+recruiterId+"/job/"+jobId+"/application/"+applicationId+"/action/"+action, null, data, function(res, status, xhr){
		if(res.status && res.status =='success'){
			return pubsub.publish("setCandidateActionSuccess:"+action, res.data);
		}
	}, function(res){
		return pubsub.publish("setCandidateActionFail:"+action, res);
	});
}
