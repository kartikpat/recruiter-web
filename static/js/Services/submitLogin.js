function submitLogin(data){
	postRequest(baseUrl+"/recruiter/login", null, data, function(res, status, xhr){
		console.log(xhr)
		if(res.status && res.status =='success'){
			var token = xhr.getResponseHeader('Set-Token');
			localStorage["recruiter-access-token"] = token;
			Set_Cookie('recruiter-access-token', token);
			return pubsub.publish("successfulLogin", res.data);
		}
	}, function(res){
		return pubsub.publish("failedLogin", res);
	});
}
