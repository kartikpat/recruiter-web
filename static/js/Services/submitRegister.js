function submitRegister(data){
	postRequest(baseUrl+"/recruiter/register", null, data, function(res, status, xhr){
		if(res.status && res.status =='success'){
			var token = xhr.getResponseHeader('Set-Token');
			localStorage["recruiter-access-token"] = token;
			Set_Cookie('recruiter-access-token', token);
			return pubsub.publish("successfulRegister", res.data);
		}
	}, function(res,status,error) {
		return pubsub.publish("failedRegister", res);
	});
}
