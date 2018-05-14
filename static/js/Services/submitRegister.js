function submitRegister(data){
	postRequest(baseUrl+"/recruiter/register", null, data, function(res, status, xhr){
		if(res.status && res.status =='success'){
			var token = xhr.getResponseHeader('Set-Token');
			localStorage[cookieName] = token;
			Set_Cookie(cookieName, token,1, "/", "iimjobs.com");
			return pubsub.publish("successfulRegister", res.data);
		}
	}, function(res,status,error) {
		return pubsub.publish("failedRegister", res);
	});
}
