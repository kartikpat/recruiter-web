function submitResetPassword(data){
	postRequest(baseUrl+"/recruiter/reset", null, data, function(res, status, xhr){
		if(res.status && res.status =='success'){
			return pubsub.publish("successfulResetPassword", res.data);
		}
	}, function(res,status,error) {
		return pubsub.publish("failedResetPassword", res);
	});
}
