function submitChatProfile(recruiterId,jobId){
	return postRequest(baseUrl+"/recruiter/"+recruiterId+"/job/"+jobId+"/application/"+applicationId+"/action/chat",function(res){
		if(res.status && res.status =='success') {
			return pubsub.publish("submitChatProfileSuccess", res);
		}

	}, function(res) {
	    return pubsub.publish("submitChatProfileFail", res);
	});
}
