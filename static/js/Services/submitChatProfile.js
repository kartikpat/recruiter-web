function submitChatProfile(recruiterId,jobId,applicationId,array,inviteObj){
	return postRequest(baseUrl+"/recruiter/"+recruiterId+"/job/"+jobId+"/application/"+applicationId+"/action/chat",null, {},function(res){
		if(res.status && res.status =='success'){
			res.array=array;
			res.inviteObj=inviteObj;
			return pubsub.publish("submitChatProfileSuccess",res);
		}
	}, function(res) {
	    return pubsub.publish("submitChatProfileFail", res);
	});
}
