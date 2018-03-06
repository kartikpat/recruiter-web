function updateRecruiterProfile(form, recruiterId){
	postRequest(baseUrl+"/recruiter/"+recruiterId+"", null, form, function(res, status, xhr){
		console.log(xhr)
		if(res.status && res.status =='success'){
			return pubsub.publish("updateRecruiterProfileSuccess", res.data);
		}
	}, function(res){
		return pubsub.publish("updateRecruiterProfileFail", res.responseJSON);
	},null,null, false,true,null,false);
}
