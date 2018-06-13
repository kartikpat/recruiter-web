function submitChatProfile(recruiterId,jobId,applicationId,array){
	return postRequest(baseUrl+"/recruiter/"+recruiterId+"/job/"+jobId+"/application/"+applicationId+"/action/chat", null, {},function(res){
		if(res.status && res.status =='success'){
			res.array=array;
			return pubsub.publish("submitChatProfileSuccess",res);
		}
	}, function(res) {
	    return pubsub.publish("submitChatProfileFail", res);
	});
}
