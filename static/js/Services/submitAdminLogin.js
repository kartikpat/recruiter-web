function submitAdminLogin(data){
	return postRequest(baseUrl+"/admin/login", null, data, function(res, status, xhr) {
		if(res.status && res.status =='success'){
			var token = xhr.getResponseHeader('Set-Token');
			// var universalToken = xhr.getResponseHeader('Set-Universal-Token');
			// console.log(universalToken);
			localStorage[cookieName] = token;
			Set_Cookie(cookieName, token,1, "/", "iimjobs.com");
			// Set_Cookie('IIMJOBS_CK1', universalToken, 1, "/", "iimjobs.com", null, true );
			return pubsub.publish("adminLoginSuccess", res.data);
		}
	}, function(res,status,error) {
		return pubsub.publish("adminLoginFail", res);
	});
}
