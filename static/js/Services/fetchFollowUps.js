function fetchFollowUps(){
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/followUps", {}, function(res){
		if(res.status && res.status =='success'){
			pubsub.publish("fetchedFollowups", res.data);
		}
	});
}
