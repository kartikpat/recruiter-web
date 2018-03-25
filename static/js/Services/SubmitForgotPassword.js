function submitForgotPassword(data){
	postRequest(baseUrl+"/recruiter/forgot-password", null, data, function(res, status, xhr){
		if(res.status && res.status =='success'){
			return pubsub.publish("successfulForgotPassword", res.data);
		}
	}, function(res,status,error) {
		return pubsub.publish("failedForgotPassword", res);
	});
}
