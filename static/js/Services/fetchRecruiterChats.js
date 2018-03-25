function fetchRecruiterChats(recruiterId){
	getRequest(baseUrl+"/recruiter/"+recruiterId+"/chat", {}, function(res){
		if(res.status && res.status =='success'){
			return pubsub.publish("fetchedRecruiterChats", res.data);
		}

	}, function(res,status,error) {
	    pubsub.publish("fetchedRecruiterChatsFail", res);
	});
}
