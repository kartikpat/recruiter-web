function fetchInterviews(recruiterId, data){
	getRequest(baseUrl+"/recruiter/"+recruiterId+"/interviews",data, function(res){
		if(res.status && res.status =='success'){
			pubsub.publish("fetchedInterviews", res.data);
		}
	});
}