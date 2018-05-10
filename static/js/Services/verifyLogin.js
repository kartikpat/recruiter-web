function verifyLogin(oldCookie){
	postRequest(baseUrl+"/recruiter/login/verify", {} , {oldCookie: oldCookie}, function(res, status, xhr){
		console.log(baseUrl)
		if(res.status && res.status =='success'){
			var token = xhr.getResponseHeader('Set-Token');
			localStorage["recruiter-access-token"] = token;
			Set_Cookie('recruiter-access-token', token);
			Set_Cookie('IIMJOBS_CK1_COPY', encodeURIComponent(oldCookie), 1, "/", "iimjobs.com", null, true );
			return pubsub.publish("loginVerifySuccess", res);
		}
		},function(res,status,error) {
			res.extraParameters = {}
			return pubsub.publish("loginVerifyFail", res);
	});
}
