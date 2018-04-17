function fetchActiveJobStats(recruiterId, parameters){
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/jobs/stats",parameters, function(res){
		if(res.status && res.status =='success'){
			pubsub.publish("fetchedActiveJobStats", res.data);
		}
	});
}
