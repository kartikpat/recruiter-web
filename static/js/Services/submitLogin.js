function submitLogin(data){
	return postRequest(baseUrl+"/recruiter/login", null, data, function(res, status, xhr) {
		if(res.status && res.status =='success'){
			var token = xhr.getResponseHeader('Set-Token');
			var universalToken = xhr.getResponseHeader('Set-Universal-Token');
			
			localStorage[cookieName] = token;
			Set_Cookie(cookieName, token,1, "/", "iimjobs.com");
			Set_Cookie(oldCookieName, universalToken, 1, "/", "iimjobs.com", null, true );
			return pubsub.publish("successfulLogin", res.data);
		}
	}, function(res,status,error) {
		return pubsub.publish("failedLogin", res);
	});
}
