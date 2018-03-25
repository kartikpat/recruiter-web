function sendInterViewInvite(recruiterId, jobId, applicationId , data){
	postRequest(baseUrl+"/recruiter/"+recruiterId+"/job/"+jobId+"/application/"+applicationId+"/action/invite", null, data, function(res, status, xhr){
		if(res.status && res.status =='success'){
            res.parameters = {}
            res.parameters.applicationId = applicationId;
            res.parameters.inviteId = inviteId;
			return pubsub.publish("sendInterViewInviteSuccess", res);
		}
	}, function(res,status,error) {
		return pubsub.publish("sendInterViewInviteFail", res);
	});
}
