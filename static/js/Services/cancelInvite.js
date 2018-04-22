function cancelInterviewInvite(recruiterId, jobId, applicationId , data){
	postRequest(baseUrl+"/recruiter/"+recruiterId+"/job/"+jobId+"/application/"+applicationId+"/action/cancel-invite", {}, data, function(res, status, xhr){
		if(res.status && res.status =='success'){
			return pubsub.publish("cancelInviteSuccess", res);
		}
	}, function(res,status,error) {
		return pubsub.publish("cancelInviteFail", res);
	});
}
