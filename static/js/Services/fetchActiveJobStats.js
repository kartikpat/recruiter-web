function fetchActiveJobStats(){
	return getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/stats", {}, function(res){
		if(res.status && res.status =='success'){
			pubsub.publish("fetchedActiveJobStats", res.data);
		}
	});
}
