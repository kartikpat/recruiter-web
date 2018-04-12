function cancelInterviewInvite(recruiterId , data){
	postRequest(baseUrl+"/recruiter/"+recruiterId+"/job/"+jobId+"/application/"+applicationId+"/action/cancel-invite", null, data, function(res, status, xhr){
		if(res.status && res.status =='success'){

			return pubsub.publish("resendInviteSuccess", res);
		}
	}, function(res,status,error) {
		return pubsub.publish("resendInviteFail", res);
	});
}
