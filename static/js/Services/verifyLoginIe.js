function verifyLoginIe(oldCookie){
	postRequest("/recruiter/login/verify", {} , {oldCookie: oldCookie}, function(res, status, xhr){
		if(res.status && res.status =='success'){
			console.log("here") 
			var token = xhr.getResponseHeader('Set-Token');
			// localStorage[cookieName] = token;
			Set_Cookie(cookieName, token,1, "/", baseDomainName);
			return pubsub.publish("loginVerifySuccessIe", res);
		}
			res.extraParameters = {}
			return pubsub.publish("loginVerifyFailIe", res);
	});
}

