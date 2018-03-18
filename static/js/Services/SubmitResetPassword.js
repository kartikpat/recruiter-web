function submitResetPassword(data){
	postRequest(baseUrl+"/recruiter/forgot-password", null, data, function(res, status, xhr){
		console.log(xhr)
		if(res.status && res.status =='success'){
			return pubsub.publish("successfulResetPassword", res.data);
		}
	}, function(res){
		return pubsub.publish("failedResetPassword", res);
	});
}
