function fetchActiveJobStats(recruiterId){
	return getRequest(baseUrl+"/recruiter/"+recruiterId+"/jobs/stats", {}, function(res){
		if(res.status && res.status =='success'){
			pubsub.publish("fetchedActiveJobStats", res.data);
		}
	});
}
