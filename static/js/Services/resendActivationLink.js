function resendActivationLink(token){
	postRequest(baseUrl+"/recruiter/resend", null, {}, function(res, status, xhr){
		if(res.status && res.status =='success') {
			return pubsub.publish("resendInviteSuccess", res);
		}
	}, function(res,status,error) {
		return pubsub.publish("resendInviteFail", res);
	});
}
