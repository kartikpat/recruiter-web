function setPassword(recruiterId, data){
	return postRequest(baseUrl+"/recruiter/"+recruiterId+"/set", null, data, function(res, status, xhr){
		if(res.status && res.status =='success'){

			return pubsub.publish("setPasswordSuccess", res);
		}
	}, function(res,status,error) {
		return pubsub.publish("setPasswordFail", res);
	});
}
