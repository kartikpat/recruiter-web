function fetchFollowUps(recruiterId){
	getRequest(baseUrl+"/recruiter/"+recruiterId+"/followUps", {}, function(res){
		if(res.status && res.status =='success'){
			pubsub.publish("fetchedFollowups", res.data);
		}
	});
}
