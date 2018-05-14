function verifyLogin(oldCookie){
	postRequest(baseUrl+"/recruiter/login/verify", {} , {oldCookie: oldCookie}, function(res, status, xhr){
		console.log(baseUrl)
		if(res.status && res.status =='success'){
			var token = xhr.getResponseHeader('Set-Token');
			localStorage[cookieName] = token;
			Set_Cookie(cookieName, token,1, "/", "iimjobs.com");
			return pubsub.publish("loginVerifySuccess", res);
		}
		},function(res,status,error) {
			res.extraParameters = {}
			return pubsub.publish("loginVerifyFail", res);
	});
}
