function submitRegister(data){
	postRequest(baseUrl+"/recruiter/register", null, data, function(res, status, xhr){
		if(res.status && res.status =='success'){
			var token = xhr.getResponseHeader('Set-Token');
			var universalToken = xhr.getResponseHeader('Set-Universal-Token');
			// localStorage[cookieName] = token;
			Set_Cookie(cookieName, token,1, "/", baseDomainName);
			Set_Cookie(oldCookieName, universalToken, 1, "/", baseDomainName, null, true );
			return pubsub.publish("successfulRegister", res.data);
		}
	}, function(res,status,error) {
		return pubsub.publish("failedRegister", res);
	});
}
