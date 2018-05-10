function submitLogin(data){
	return postRequest(baseUrl+"/recruiter/login", null, data, function(res, status, xhr) {
		if(res.status && res.status =='success'){
			var token = xhr.getResponseHeader('Set-Token');
			var universalToken = xhr.getResponseHeader('Set-Universal-Token');
			console.log(universalToken);
			localStorage["recruiter-access-token"] = token;
			Set_Cookie('recruiter-access-token', token);
			Set_Cookie('IIMJOBS_CK1', universalToken, 1, "/", "iimjobs.com", null, true );
			Set_Cookie('IIMJOBS_CK1_COPY', universalToken, 1, "/", "iimjobs.com", null, true );
			return pubsub.publish("successfulLogin", res.data);
		}
	}, function(res,status,error) {
		return pubsub.publish("failedLogin", res);
	});
}
