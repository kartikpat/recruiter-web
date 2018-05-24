function submitChatMessage(data){
	return postRequest(baseUrl+"/recruiter/"+recruiterId+"/chat/channel/message", null, data, function(res, status, xhr) {
		if(res.status && res.status =='success'){
			return pubsub.publish("successfulChatMessageSent", res.data);
		}
	}, function(res,status,error) {
		return pubsub.publish("failedChatMessage", res);
	});
}
